"use client";

import Destination from "@/components/send/Destination";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import initWeb5 from "@/web5/auth/access";
import { ClockCircleOutlined, LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Select,
  Spin,
  Steps,
} from "antd";
import type { GetProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Web5 } from "@web5/api";
import { useRouter, useSearchParams } from "next/navigation";
import getPfiOfferings from "@/web5/send/offering";
import type { Offering } from "@tbdex/http-client";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [web5, setWeb5] = useState<Web5>();
  const [userDid, setUserDid] = useState<string>();
  const [userAccounts, setUserAccounts] = useState<userAccountDetails[]>();
  const [countries, setCountries] = useState<CountryProps[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<CountryProps>();
  const [recipientDetails, setRecipientDetails] = useState<RecipientDetails>();
  const [amountToSend, setAmountToSend] = useState<number>();
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [debitAccount, setDebitAccount] = useState<userAccountDetails>();
  const [offerings, setOfferings] = useState<Offering[]>();
  const [offeringRate, setOfferingRate] = useState<number>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const acctSymbols = {
    USD: "$",
    EUR: "€",
    KES: "Ksh",
  };

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
                  Object.keys(country.currencies)[0] === "AUD" ||
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
    const urlParam = searchParams.get("currency");
    if (urlParam && userAccounts) {
      const account = userAccounts.find(
        (acct) => acct.accountType === urlParam
      );
      if (account) {
        setDebitAccount(account);
      }
    }
  }, [userAccounts]);

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

  useEffect(() => {
    async function fetchOfferings() {
      if (!debitAccount || !selectedCountry) return;
      setIsLoadingOfferings(true);
      const response = await getPfiOfferings({
        from: debitAccount?.accountType,
        to: Object.keys(selectedCountry?.currencies)[0],
      });

      if (Object.keys(response)[0] === "directSend") {
        const offer: Offering[] = response.directSend;
        if (offer.length === 1) {
          setOfferings(offer);
          setOfferingRate(+offer[0].data.payoutUnitsPerPayinUnit);
        } else {
          const bestOffer = offer.reduce((max, val) =>
            val.data.payoutUnitsPerPayinUnit > max.data.payoutUnitsPerPayinUnit
              ? val
              : max
          );
          setOfferings([bestOffer]);
          setOfferingRate(+bestOffer.data.payoutUnitsPerPayinUnit);
        }
      }

      if (Object.keys(response)[0] === "usdSend") {
        const from: Offering[] = response["usdSend"].from;
        const to: Offering[] = response["usdSend"].to;

        console.log(from, to);

        if (from.length === 1) {
          setOfferings(from);
          setOfferingRate(+from[0].data.payoutUnitsPerPayinUnit);
        } else {
          const bestFromOffer = from.reduce((max, val) =>
            val.data.payoutUnitsPerPayinUnit > max.data.payoutUnitsPerPayinUnit
              ? val
              : max
          );
          setOfferings([bestFromOffer])
          setOfferingRate(+bestFromOffer.data.payoutUnitsPerPayinUnit);
        }

        if(to.length === 1){
          setOfferings(to);
          setOfferingRate(+to[0].data.payoutUnitsPerPayinUnit);
        }else{
          const bestToOffer = to.reduce((max, val) =>
            val.data.payoutUnitsPerPayinUnit > max.data.payoutUnitsPerPayinUnit
              ? val
              : max
          );
          setOfferings([bestToOffer])
          setOfferingRate((prev)=> prev && +bestToOffer.data.payoutUnitsPerPayinUnit * prev);
        }
      }

      if (Object.keys(response)[0] === "eurSend") {
        const from: Offering[] = response["eurSend"].from;
        const to: Offering[] = response["eurSend"].to;

        console.log(from, to);

        if (from.length === 1) {
          setOfferings(from);
          setOfferingRate(+from[0].data.payoutUnitsPerPayinUnit);
        } else {
          const bestFromOffer = from.reduce((max, val) =>
            val.data.payoutUnitsPerPayinUnit > max.data.payoutUnitsPerPayinUnit
              ? val
              : max
          );
          setOfferings([bestFromOffer])
          setOfferingRate(+bestFromOffer.data.payoutUnitsPerPayinUnit);
        }

        if(to.length === 1){
          setOfferings(to);
          setOfferingRate(+to[0].data.payoutUnitsPerPayinUnit);
        }else{
          const bestToOffer = to.reduce((max, val) =>
            val.data.payoutUnitsPerPayinUnit > max.data.payoutUnitsPerPayinUnit
              ? val
              : max
          );
          setOfferings([bestToOffer])
          setOfferingRate((prev)=> prev && +bestToOffer.data.payoutUnitsPerPayinUnit * prev);
        }
      }

      setIsLoadingOfferings(false);
    }
    fetchOfferings();
  }, [debitAccount, selectedCountry]);

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
                    Object.keys(selectedCountry.currencies)[0] === "AUD") && (
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
              <h2 className='text-center font-semibold mb-6 mt-4'>
                Enter amount to send to recipient
              </h2>
              <div>
                <p className='mb-1'>Amount to send</p>
                <div className='rounded-xl py-3 px-2 hover:bg-neutral-50 transition-all ease-in duration-300 cursor-pointer border'>
                  <div className='flex justify-between items-start gap-4'>
                    <div>
                      <Select
                        defaultValue={searchParams.get("currency") || ""}
                        className='w-[70px]'
                        onChange={(e) =>
                          setDebitAccount(
                            userAccounts?.find((acct) => acct.accountType === e)
                          )
                        }
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
                      <p className='text-sm font-medium text-neutral-500 mt-1'>
                        Bal: {debitAccount?.balance || "0.00"}
                      </p>
                    </div>
                    <InputNumber
                      prefix={
                        acctSymbols[
                          debitAccount?.accountType as keyof typeof acctSymbols
                        ] || "Ksh"
                      }
                      parser={(value) =>
                        value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                      }
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      style={{ border: "none" }}
                      size='large'
                      className='w-28'
                      onChange={(value) =>
                        value === null
                          ? setAmountToSend(undefined)
                          : setAmountToSend(value)
                      }
                    />
                  </div>
                </div>
                <p className='text-red-400 mt-1'>
                  {debitAccount &&
                    amountToSend &&
                    debitAccount.balance < amountToSend &&
                    "Insufficient funds in wallet"}
                </p>

                <Spin spinning={isLoadingOfferings} tip='Loading offerings'>
                  <div className='bg-neutral-50 rounded-xl p-4 mt-8'>
                    <div className='flex justify-between items-center gap-4 py-2'>
                      <p className='text-neutral-500'>Conversion Fee</p>
                      <p className='text-neutral-700'>
                        {
                          acctSymbols[
                            debitAccount?.accountType as keyof typeof acctSymbols
                          ]
                        }
                        {amountToSend && amountToSend * 0.01}
                      </p>
                    </div>
                    <div className='flex justify-between items-center gap-4 py-2'>
                      <p className='text-neutral-500'>Send Fee</p>
                      <p className='text-neutral-700'>
                        {
                          acctSymbols[
                            debitAccount?.accountType as keyof typeof acctSymbols
                          ]
                        }
                        {amountToSend && amountToSend * 0.0208}
                      </p>
                    </div>
                    <Divider />
                    <div className='flex justify-between items-center gap-4 py-2'>
                      <p className='text-neutral-500'>Amount we'll send</p>
                      <p className='text-neutral-700 font-medium'>
                        ~
                        {
                          acctSymbols[
                            debitAccount?.accountType as keyof typeof acctSymbols
                          ]
                        }
                        {amountToSend && (amountToSend * 0.9692).toFixed(2)}
                      </p>
                    </div>
                    <div className='flex justify-between items-center gap-4 py-2'>
                      <p className='text-neutral-500'>Rate</p>
                      <p className='text-neutral-700'>
                        &times;
                        {offeringRate && offeringRate.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Spin>

                <p className='mb-1 mt-8'>Recipient will receive</p>
                <div className='w-full rounded-xl border text-center font-semibold text-base cursor-pointer py-3'>
                  <p>
                    {selectedCountry &&
                      Object.values(selectedCountry.currencies)[0].symbol}
                    {offeringRate &&
                      amountToSend &&
                      (offeringRate * amountToSend * 0.9692).toFixed(2)}
                  </p>
                </div>

                <p className='text-center text-gray-400 mt-4 mb-2'>
                  <ClockCircleOutlined /> Usually arrives in 120 minutes
                </p>

                <Button
                  className='my-4 w-full'
                  size='large'
                  type='primary'
                  disabled={amountToSend === undefined}>
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {contextHolder}
    </Content>
  );
}
