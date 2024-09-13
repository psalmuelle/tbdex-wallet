"use client";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import CredentialCard from "@/components/kcc/CredentialCard";
import { Button, Empty, Layout, message, Spin } from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { VerifiableCredential } from "@web5/credentials";
import { useRouter } from "next/navigation";
import CreateKccForm from "@/components/kcc/CreateKccForm";
import initWeb5 from "@/web5/auth/access";
import type { Web5 } from "@web5/api";
import getKcc from "@/web5/kcc/read";
import shortenText from "@/lib/shortenText";
import createKcc from "@/web5/kcc/create";
import { DeleteOutlined } from "@ant-design/icons";
import DeleteKccModal from "@/components/kcc/DeleteKccModal";
import deleteKcc from "@/web5/kcc/delete";

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
  const [web5, setWeb5] = useState<Web5>();
  const [userDid, setUserDid] = useState<string>();
  const [recordId, setRecordId] = useState<string>();
  const [pageLoading, setPageLoading] = useState(true);
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [kccInfo, setKccInfo] = useState<KccInfoProps>();
  const [formStep, setFormStep] = useState(0);
  const [reload, setReload] = useState(false);
  const router = useRouter();

  //Fetch all countries if modal is open
  useEffect(() => {
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
    isModalOpen && getCountries();
  }, [isModalOpen]);

  // Initialize web5
  useEffect(() => {
    setPageLoading(true);
    async function initializeWeb5() {
      const { web5, userDID } = await initWeb5({ password: sessionKey });

      if (web5 && userDID) {
        setWeb5(web5);
        setUserDid(userDID);
      }
    }
    initializeWeb5();
  }, []);

  //Fetch Known Customer Credential if any
  useEffect(() => {
    setPageLoading(true);
    async function fetchKcc() {
      if (!web5) return;
      const response = await getKcc({ web5 });
      if (response?.records && response.records.length > 0) {
        setRecordId(response.records[0].id);
        const rawCredential = await response.records[0].data.text();
        const credential: any = VerifiableCredential.parseJwt({
          vcJwt: rawCredential,
        });
        const credentialInfo = {
          name: credential.vcDataModel.credentialSubject.name,
          countryCode:
            credential.vcDataModel.credentialSubject.countryOfResidence,
          expiresAt: new Date(credential.vcDataModel.expirationDate)
            .toISOString()
            .split("T")[0],
          issuer: shortenText(credential.issuer, 12, 4),
        };
        localStorage.removeItem("offering");
        setPageLoading(false);
        setKccInfo(credentialInfo);
      } else {
        setPageLoading(false);
        const info = localStorage.getItem("offering");
        if (info === null) {
          return;
        } else {
          setIsModalOpen(true);
        }
      }
    }

    fetchKcc();
  }, [web5, reload]);

  //Handles Modal Close
  function handleCloseModal() {
    setIsModalOpen(false);
    localStorage.removeItem("offering");
  }

  const onFinish: FormProps<KccFormProps>["onFinish"] = async (values) => {
    setIsSubmitLoading(true);
    await axios
      .get(
        `https://mock-idv.tbddev.org/kcc?name=${values.customerName}&country=${values.countryCode}&did=${userDid}`
      )
      .then(async (res) => {
        await createKcc({
          userDid: userDid!,
          vcJwt: res.data,
          web5: web5!,
        });
        setIsSubmitLoading(false);
        setFormStep(1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle Close Modal After KCC creation
  function handleOk() {
    if (localStorage.getItem("offering")) {
      router.push("/dashboard/convert");
    } else {
      setIsModalOpen(false);
      setReload(!reload);
    }
  }
  //Shows Delete Confirmation Modal
  async function handleDeleteKcc() {
    setIsSubmitLoading(true);
    await deleteKcc({ web5: web5!, recordId: recordId! }).then((res) => {
      if (res?.code === 202) {
        const timeoutId = setTimeout(() => {
          messageApi.success("KCC deleted successfully");
          setIsSubmitLoading(false);
          setIsDeleteModalOpen(false);
          setKccInfo(undefined);
        }, 1500);
        return () => clearTimeout(timeoutId);
      }
    });
  }

  return (
    <Content className='mt-8 mx-4'>
      <div className='flex justify-between gap-4 items-center'>
        <h1 className='font-bold text-base mb-4'>My Verifiable Credentials</h1>
        {kccInfo && (
          <Button
            danger
            shape='circle'
            onClick={() => setIsDeleteModalOpen(true)}
            icon={<DeleteOutlined />}
          />
        )}
      </div>

      <section className='min-h-[75vh] mt-12'>
        {pageLoading && <Spin fullscreen />}
        {kccInfo && (
          <CredentialCard
            name={kccInfo.name}
            country={kccInfo.countryCode}
            issuedBy={kccInfo.issuer}
            expires={kccInfo.expiresAt}
          />
        )}
        {!pageLoading && !kccInfo && (
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

        <CreateKccForm
          handleOk={handleOk}
          isSubmitLoading={isSubmitLoading}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          formStep={formStep}
          onFinish={onFinish}
          countries={countries}
        />
        <DeleteKccModal
          open={isDeleteModalOpen}
          confirmLoading={isSubmitLoading}
          onCancel={() => setIsDeleteModalOpen(false)}
          onOk={handleDeleteKcc}
        />
      </section>
      {contextHolder}
    </Content>
  );
}
