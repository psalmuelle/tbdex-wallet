"use client";
import { SendOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, InputNumber, Modal } from "antd";
import type { FormProps } from "antd";

type Props = {
  open: boolean;
  setClose: () => void;
  amountAvailable: number;
};
type FieldType = {
  address: string;
  amount: number;
};

export default function SendBtcModal({
  open,
  setClose,
  amountAvailable,
}: Props) {
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  return (
    <Modal
      open={open}
      onCancel={setClose}
      destroyOnClose
      maskClosable={false}
      footer={null}
      title={
        <div className='flex items-center gap-1'>
          <h1 className='font-bold'>Send Bitcoin </h1>
          <Avatar size={"small"} src={"/btc.svg"} alt='btc vector' />
        </div>
      }>
      <Form
        layout='vertical'
        className='max-w-sm mx-auto mt-6'
        onFinish={onFinish}>
        <Form.Item<FieldType>
          name={"address"}
          label={"Receiver Bitcoin Address"}
          rules={[{ required: true, message: "Please recipient address" }]}>
          <Input size='large' placeholder='Enter Bitcoin Address' />
        </Form.Item>
        <Form.Item<FieldType>
          label={"Amount to send in BTC"}
          name={"amount"}
          rules={[
            { required: true, message: "" },
            {
              validator: (_, value) => {
                if (value <= 0) {
                  return Promise.reject(
                    new Error("Amount must be greater than 0")
                  );
                }
                if (value > amountAvailable) {
                  return Promise.reject(
                    new Error(`Amount cannot exceed ${amountAvailable} BTC`)
                  );
                }
                return Promise.resolve();
              },
            },
          ]}>
          <InputNumber
            className='w-full'
            size='large'
            addonAfter={"₿"}
            min={0}
          />
        </Form.Item>
        <p className='text-gray-500 cursor-pointer text-xs font-medium -mt-6 w-fit'>
          Max: {amountAvailable}
        </p>

        <Button
          icon={<SendOutlined />}
          type='primary'
          size='large'
          htmlType='submit'
          className='w-full mb-6 mt-4'>
          Send
        </Button>
      </Form>
    </Modal>
  );
}
