"use client";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import CredentialCard from "@/components/credentials/CredentialCard";
import { Button, Divider, Form, Input, Layout, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { ManageKnownCustomerCredentials } from "@/lib/web5/kcc";
import { VerifiableCredential } from "@web5/credentials";

const { Content } = Layout;

type KccFormProps = {
  countryCode: string;
  customerName: string;
};

export default function KCC() {
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const userDID = decryptAndRetrieveData({ name: "userDID" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    //Fetch all countries
    async function getCountries() {
      await axios
        .get("https://restcountries.com/v3.1/all?fields=name,cca3")
        .then((res) => {
          const filteredData = res.data.map(
            (country: { name: { common: string }; cca3: string }) => ({
              label: country.name.common,
              value: country.cca3,
            })
          );

          setCountries(filteredData);
        });
      // (await ManageKnownCustomerCredentials({password: sessionKey})).get().then(res=>{
      //   if (res?.records) {
      //     console.log(res.records[0].data.text());
      //   }
      // })
    }
    getCountries();
  }, []);

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  const onFinish: FormProps<KccFormProps>["onFinish"] = async (values) => {
    setIsSubmitLoading(true);
    await axios
      .get(
        `https://mock-idv.tbddev.org/kcc?name=${values.customerName}&country=${values.countryCode}&did=${userDID}`
      )
      .then(async (res) => {
        (
          await ManageKnownCustomerCredentials({
            password: sessionKey,
            vcJwt: res.data,
          })
        ).save();
        setIsSubmitLoading(false);
        setIsModalOpen(false);
      });
  };

  return (
    <Content className='mt-8 mx-4'>
      <div>
        <h1 className='font-bold text-base mb-4'>My Verifiable Credentials</h1>
      </div>

      <section className='min-h-[75vh] mt-12'>
        <CredentialCard
          name='John Doe'
          country='NGN'
          email='psalmuelle1@gmail.com'
          issuedBy='did:dht:2162...2123'
          expires='24-10-2024'
        />
        <Modal
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          maskClosable={false}
          destroyOnClose
          className='max-w-[350px]'>
          <h1 className='font-semibold'>
            Create your Known Customer Credential
          </h1>
          <Divider />
          <Form
            autoComplete='off'
            onFinish={onFinish}
            layout='vertical'
            requiredMark={"optional"}
            className='mb-4'>
            <Form.Item<KccFormProps>
              label='Your Full Name'
              name='customerName'
              rules={[{ required: true, message: "PFI name is required!" }]}>
              <Input size='large' />
            </Form.Item>

            <Form.Item<KccFormProps>
              label='Country'
              name='countryCode'
              rules={[{ required: true, message: "DID is required!" }]}>
              <Select
                showSearch
                optionFilterProp='label'
                size='large'
                options={countries}
              />
            </Form.Item>

            <Button
              type='primary'
              htmlType='submit'
              loading={isSubmitLoading}
              size='large'
              className='w-full'>
              Submit
            </Button>
          </Form>
        </Modal>
      </section>
    </Content>
  );
}
