import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Form, FormProps, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import type { Web5 } from "@web5/api";

interface CreateFiatsModalProps {
  open: boolean;
  activeWallet: string;
  reloadWallets: () => void;
  web5: Web5;
  handleClose: () => void;
}

interface FieldType {
  accountNumber: string;
  routingNumber?: string;
  iban?: string;
  swiftCode?: string;
}

export default function CreateFiatsModal({
  open,
  activeWallet,
  web5,
  reloadWallets,
  handleClose,
}: CreateFiatsModalProps) {
  const [lastInput, setLastInput] = useState<{
    name: keyof FieldType;
    label: string;
  }>({
    name: "accountNumber",
    label: "Account Number",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (activeWallet === "USD") {
      setLastInput({ name: "routingNumber", label: "Routing Number" });
    } else if (activeWallet === "EUR") {
      setLastInput({ name: "iban", label: "IBAN" });
    } else if (activeWallet === "KES") {
      setLastInput({ name: "swiftCode", label: "Swift Code" });
    }
  }, [activeWallet]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setFormLoading(true);
      if (web5) {
        const response = await web5.dwn.records.create({
          data: {
            accountType: activeWallet,
            accountNumber: values.accountNumber,
            [lastInput.name]: values[lastInput.name],
            balance: 0,
          },
          message: {
            schema: "BankAccountsInfo",
            dataFormat: "application/json",
          },
        });
        if (response.record) {
          await response.record.send();
          messageApi.success(`${activeWallet} account created successfully`);
          reloadWallets();
          handleClose();
        }
      }
      setFormLoading(false);
    } catch (err) {
      console.log(err);
      setFormLoading(false);
      messageApi.success(`An error occured`);
    }
  };

  return (
    <>
      <Modal
        footer={null}
        destroyOnClose
        onCancel={() => {
          handleClose();
          setFormLoading(false);
        }}
        open={open}
        title={`Create ${activeWallet} Account`}>
        <div className='flex gap-1 items-center'>
          <CloseCircleOutlined className='text-red-400' />
          <p>
            This app is still in development. Please, do not use your real
            account details
          </p>
        </div>
        <div>
          <Divider>Connect account</Divider>
          <Form
            requiredMark={false}
            layout='vertical'
            className='max-w-sm mx-auto mt-6'
            onFinish={onFinish}>
            <Form.Item<FieldType>
              name={"accountNumber"}
              label={"Account Number"}
              rules={[
                { required: true, message: "Input your account number" },
              ]}>
              <Input size='large' placeholder='Account Number' />
            </Form.Item>
            <Form.Item<FieldType>
              name={lastInput.name}
              label={lastInput.label}
              rules={[
                { required: true, message: "Input your account number" },
              ]}>
              <Input size='large' placeholder={lastInput.label} />
            </Form.Item>

            <Form.Item>
              <Button
                loading={formLoading}
                className='w-full'
                size='large'
                type='primary'
                htmlType='submit'>
                Connect
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {contextHolder}
    </>
  );
}
