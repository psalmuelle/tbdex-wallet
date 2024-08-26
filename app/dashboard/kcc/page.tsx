"use client";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import CredentialCard from "@/components/credentials/CredentialCard";
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  Layout,
  Modal,
  Select,
  Spin,
} from "antd";
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

type KccInfoProps = {
  name: string;
  countryCode: string;
  issuer: string;
  expiresAt: string;
};

export default function KCC() {
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const userDID = decryptAndRetrieveData({ name: "userDID" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [kccInfo, setKccInfo] = useState<KccInfoProps>();
  const [kccLoading, setKccLoading] = useState(false);
  const [reload, setReload] = useState(false);

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
    }
    getCountries();
  }, []);

  useEffect(() => {
    setKccLoading(true);
    async function fetchKCC() {
      //Get Known Customer Credential
      (await ManageKnownCustomerCredentials({ password: sessionKey }))
        .get()
        .then((res) => {
          if (res?.records && res.records.length > 0) {
            res.records[0].data.text().then((data: string) => {
              const vc: any = VerifiableCredential.parseJwt({ vcJwt: data });
              const shortIssuerDid: string =
                vc.issuer.substring(0, 12) +
                "...." +
                vc.issuer.substring(userDID.length - 4);
              const name: string = vc.vcDataModel.credentialSubject.name;
              const country: string =
                vc.vcDataModel.credentialSubject.countryOfResidence;
              const dateTimeString: string = vc.vcDataModel.expirationDate;
              const date = new Date(dateTimeString!);
              const expiresAt: string = date.toISOString().split("T")[0];

              const info = {
                name,
                countryCode: country,
                expiresAt,
                issuer: shortIssuerDid,
              };
              setKccLoading(false);
              setKccInfo(info);
            });
          } else {
            setKccLoading(false);
            return;
          }
        });
    }
    fetchKCC();
  }, [reload]);

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
        setReload(!reload);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Content className='mt-8 mx-4'>
      <div>
        <h1 className='font-bold text-base mb-4'>My Verifiable Credentials</h1>
      </div>

      <section className='min-h-[75vh] mt-12'>
        {kccLoading && <Spin fullscreen />}
        {kccInfo && (
          <CredentialCard
            name={kccInfo.name}
            country={kccInfo.countryCode}
            issuedBy={kccInfo.issuer}
            expires={kccInfo.expiresAt}
          />
        )}
        {!kccLoading && !kccInfo && (
          <>
            <Empty description={"No verified Known Customer Credential"} />
            <Button
              onClick={() => setIsModalOpen(true)}
              type='primary'
              size='large'
              className='block mt-8 mx-auto'>
              Apply for a KCC
            </Button>
          </>
        )}
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
