"use client";

import Destination from "@/components/send/Destination";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import initWeb5 from "@/web5/auth/access";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Layout, message, Select, Steps } from "antd";
import type { GetProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Web5 } from "@web5/api";
import { useRouter } from "next/navigation";

const { Content } = Layout;

type InputProps = GetProps<typeof Input>;
interface CountryProps {
  name: {
    common: string;
  };
  currencies: {
    [key: string]: {
      symbol: string;
      name: string;
    };
  };
  flags: {
    alt: string;
    png: string;
  };
}

interface RecipientDetails {
  bankAccount: string;
  country: string;
  currency: string;
  routingNumber?: string;
  iban?: string;
  sortCode?: string;
  swiftCode?: string;
}

interface userAccountDetails {
  accountType: string;
  accountNumber: string;
  balance: number;
  routingNumber?: string;
  iban?: string;
  swiftCode?: string;
}

export default function Send() {
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [currentStep, setCurrentStep] = useState(2);
  const [web5, setWeb5] = useState<Web5>();
  const [userDid, setUserDid] = useState<string>();
  const [userAccounts, setUserAccounts] = useState<userAccountDetails[]>();
  const [countries, setCountries] = useState<CountryProps[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<CountryProps>();
  const [recipientDetails, setRecipientDetails] = useState<RecipientDetails>();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const onChange: InputProps["onChange"] = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  useEffect(() => {
    async function getAllCountries() {
      try {
        await axios
          .get(
            "https://restcountries.com/v3.1/all?fields=name,currencies,flags"
          )
          .then((res) => {
            const filteredResult: CountryProps[] = res.data.filter(
              (country: CountryProps) =>
                country.currencies &&
                (Object.keys(country.currencies)[0] === "EUR" ||
                  Object.keys(country.currencies)[0] === "USD" ||
                  Object.keys(country.currencies)[0] === "GBP" ||
                  Object.keys(country.currencies)[0] === "NGN" ||
                  Object.keys(country.currencies)[0] === "KES")
            );
            setCountries(filteredResult);
          });
      } catch (err) {
        console.log(err);
      }
    }
    getAllCountries();
  }, []);

  useEffect(() => {
    async function initializeWeb5() {
      try {
        const { web5: userWeb5, userDID } = await initWeb5({
          password: sessionKey,
        });
        setWeb5(userWeb5);
        setUserDid(userDID);
      } catch (err) {
        console.log(err);
      }
    }
    initializeWeb5();
  }, []);

  useEffect(() => {
    async function getAccountDetails() {
      try {
        if (!web5) return;
        const response = await web5.dwn.records.query({
          message: {
            filter: {
              schema: "BankAccountsInfo",
              dataFormat: "application/json",
            },
          },
        });

        if (response.records === undefined) return;
        if (response.records.length === 0) {
          messageApi.error("Create an account to send money");
          router.push("/dashboard");
          return;
        }
        const allAccts: userAccountDetails[] = [];
        for (const record of response.records) {
          const data = await record.data.json();
          allAccts.push(data);
        }
        setUserAccounts(allAccts);
      } catch (err) {
        console.log(err);
      }
    }
    getAccountDetails();
  }, [web5]);

  const handleSubmitRecipientDetails = (values: RecipientDetails) => {
    setRecipientDetails(values);
    setCurrentStep(currentStep + 1);
  };

  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Send Money</h1>
      <div className='w-fit mx-auto p-8 mt-1 mb-24 rounded-xl bg-white'>
        <div className='w-6 h-6 mb2 rounded-full'>
          {currentStep !== 0 && (
            <Button
              icon={<LeftOutlined />}
              shape='circle'
              size='small'
              onClick={() => setCurrentStep(currentStep - 1)}
            />
          )}
        </div>
        <Steps
          progressDot
          current={currentStep}
          size='small'
          responsive
          items={[
            {
              title: "Destination",
            },
            {
              title: "Enter Bank Account Details",
            },
            {
              title: "Enter Amount",
            },
            {
              title: "Review Transaction",
            },
            {
              title: "Authorize Payment",
            },
          ]}
        />
        <div className='w-full max-w-md mx-auto mt-4'>
          {currentStep === 0 && (
            <div className='w-full max-w-md mx-auto mt-4'>
              <h2 className='text-center font-semibold mb-4 mt-6'>
                Choose the country you are sending money to
              </h2>
              <Input
                type='search'
                size='large'
                className='py-3'
                placeholder='Search by country or currency'
                onChange={onChange}
              />
              <div className='mt-6 max-h-[300px] overflow-y-auto hide-scrollbar flex flex-col gap-3'>
                {countries
                  .filter(
                    (country) =>
                      country.currencies &&
                      (country.name.common
                        .toLowerCase()
                        .includes(searchValue!.toLocaleLowerCase()) ||
                        Object.keys(country.currencies).includes(
                          searchValue!.toUpperCase()
                        ) ||
                        Object.values(country.currencies)[0]
                          .name.toLocaleLowerCase()
                          .includes(searchValue!.toLowerCase()))
                  )
                  .map((val, i) => {
                    return (
                      <Destination
                        key={i}
                        alt={val.flags.alt}
                        onClick={() => {
                          setSelectedCountry(val);
                          setCurrentStep(1);
                        }}
                        flag={val.flags.png}
                        country={val.name.common}
                        currency={Object.keys(val.currencies)[0]}
                        currencySymbol={
                          (
                            Object.values(val.currencies)[0] as {
                              symbol: string;
                            }
                          ).symbol
                        }
                      />
                    );
                  })}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className='w-full max-w-md mx-auto mt-8'>
              <h2 className='text-center font-semibold mb-4 mt-4'>
                Enter recipient details
              </h2>
              <Form
                layout='vertical'
                requiredMark={false}
                onFinish={handleSubmitRecipientDetails}>
                <Form.Item
                  name={"country"}
                  initialValue={selectedCountry?.name.common}
                  label={"Recipient Country"}>
                  <Input disabled className='mt-1.5' size='large' />
                </Form.Item>

                <Form.Item
                  className='mt-4'
                  name={"bankAccount"}
                  label={"Bank Account"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your recipient bank account",
                    },
                  ]}>
                  <Input
                    size='large'
                    placeholder='Recipient bank account'
                    className='mt-1.5'
                  />
                </Form.Item>

                {selectedCountry &&
                  Object.keys(selectedCountry.currencies)[0] === "USD" && (
                    <Form.Item
                      name={"routingNumber"}
                      className='mt-4'
                      label={"Routing Number"}
                      rules={[
                        {
                          required: true,
                          message: "Please input recipient routing number",
                        },
                      ]}>
                      <Input
                        size='large'
                        placeholder='Routing Number'
                        className='mt-1.5'
                      />
                    </Form.Item>
                  )}

                {selectedCountry &&
                  (Object.keys(selectedCountry.currencies)[0] === "EUR" ||
                    Object.keys(selectedCountry.currencies)[0] === "NGN") && (
                    <Form.Item
                      className='mt-4'
                      label={"IBAN"}
                      name={"iban"}
                      rules={[
                        {
                          required: true,
                          message: "Please input recipient IBAN",
                        },
                      ]}>
                      <Input
                        size='large'
                        placeholder='IBAN'
                        className='mt-1.5'
                      />
                    </Form.Item>
                  )}

                {selectedCountry &&
                  Object.keys(selectedCountry.currencies)[0] === "GBP" && (
                    <Form.Item
                      className='mt-4'
                      name={"sortCode"}
                      label={"Sort Code"}
                      rules={[
                        {
                          required: true,
                          message: "Please input recipient sort code",
                        },
                      ]}>
                      <Input name='sortCode' size='large' className='mt-1.5' />
                    </Form.Item>
                  )}

                {selectedCountry &&
                  Object.keys(selectedCountry.currencies)[0] === "KES" && (
                    <Form.Item
                      className='mt-4'
                      name={"swiftCode"}
                      label={"Swift Code"}
                      rules={[
                        {
                          required: true,
                          message: "Please input recipient Swift Code",
                        },
                      ]}>
                      <Input name='swiftCode' size='large' className='mt-1.5' />
                    </Form.Item>
                  )}

                <Button
                  htmlType='submit'
                  className='w-full mt-8 mb-6'
                  type='primary'
                  size='large'>
                  Continue
                </Button>
              </Form>
            </div>
          )}

          {currentStep === 2 && (
            <div className='w-full max-w-md mx-auto mt-8'>
              <h2 className='text-center font-semibold mb-4 mt-4'>
                Enter amount to send to recipient
              </h2>
              <div>
                <p className='mb-1'>Amount to send</p>
                <div className='rounded-xl py-3 px-2 hover:bg-neutral-100 transition-all ease-in duration-300 cursor-pointer border'>
                  <div>
                    <Select
                      defaultValue={"USD"}
                      onChange={() => {}}
                      options={
                        userAccounts &&
                        userAccounts.map((acct) => {
                          return {
                            value: acct.accountType,
                            label: acct.accountType,
                          };
                        })
                      }
                      loading={!userAccounts}
                    />
                    <p>{}</p>
                  </div>
                </div>
                <div>Recipient will receive</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {contextHolder}
    </Content>
  );
}
