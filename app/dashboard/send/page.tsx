"use client";

import Destination from "@/components/send/Destination";
import { RightOutlined } from "@ant-design/icons";
import { Button, Form, Input, Layout, Steps } from "antd";
import type { GetProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

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

export default function Send() {
  const [currentStep, setCurrentStep] = useState(0);
  const [countries, setCountries] = useState<CountryProps[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<CountryProps>();

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

  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Send Money</h1>
      <div className='w-fit mx-auto p-8 mt-6 mb-24 rounded-xl bg-white'>
        <div className='flex mt-6'>
          {currentStep !== 0 && (
            <Button
              icon={<RightOutlined />}
              shape='circle'
              onClick={() => setCurrentStep(currentStep - 1)}
            />
          )}
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
        </div>
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
                Enter recipient detials
              </h2>
              <div>
                <label htmlFor='country'>Recipient Country</label>
                <Input
                  name='country'
                  value={selectedCountry?.name.common}
                  disabled
                  className='mt-1.5'
                  size='large'
                />
              </div>

              <div className='mt-4'>
                <p>Bank Account</p>
                <Input size='large' className='mt-1.5' />
              </div>

              <div className='mt-4'>
                <p>Bank Account</p>
                <Input size='large' className='mt-1.5' />
              </div>

              <Button className="w-full mt-8 mb-6" type="primary" size="large">Continue</Button>
            </div>
          )}
        </div>
      </div>
    </Content>
  );
}
