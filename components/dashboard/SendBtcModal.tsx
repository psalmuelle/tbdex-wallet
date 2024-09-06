"use client";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Result,
  Spin,
} from "antd";
import type { FormProps } from "antd";
import { sendBitcoin } from "@/lib/web3/tnx.bitcoin";
import { useState } from "react";

type Props = {
  open: boolean;
  setClose: () => void;
  amountAvailable: number;
  wallet: {
    privateKey: string;
    address: string;
  };
};
type FieldType = {
  address: string;
  amount: number;
};

export default function SendBtcModal({
  open,
  setClose,
  amountAvailable,
  wallet,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"success" | "failed">();
  const [txState, setTxState] = useState(0);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setSubmitting(true);
    try {
      await sendBitcoin({
        receiverAddress: values.address,
        amountToSend: values.amount,
        privateKey: wallet?.privateKey!,
        payerAddress: wallet?.address!,
      }).then((res) => {
        console.log(res);
        setStatus("success");
        setTxState(1);
      });
    } catch (err) {
      console.log(err);
      setStatus("failed");
      setTxState(1);
    }
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
      {txState === 0 && (
        <Spin spinning={submitting} tip='Sending Bitcoin...'>
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
        </Spin>
      )}
      {txState === 1 && (
        <div>
          {status === "success" ? (
            <div className='my-6'>
              <Result
                status={"success"}
                title='Transaction Submitted!'
                extra={
                  <Button
                    size='large'
                    onClick={() => setClose()}
                    className='w-full bg-green-500 text-white hover:border-green-400'>
                    Exit
                  </Button>
                }
              />
            </div>
          ) : (
            <div className='my-6'>
              <Result
                status={"warning"}
                title='An Error Occured While Processing the Transaction!'
                subTitle='Please, try again later'
                extra={<Button type='primary'>Exit</Button>}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
