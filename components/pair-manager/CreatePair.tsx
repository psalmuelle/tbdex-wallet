import { Button, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { useState } from "react";
import axiosInstance from "@/lib/axios";

interface CreatePairModalProps {
  open: boolean;
  onCancel: () => void;
  setReload: () => void;
  setMessage: (message: string, type: "success" | "error") => void;
}

type FormTypes = {
  from: string;
  to: string;
  type: string;
};

export default function CreatePairModal({
  open,
  onCancel,
  setReload,
  setMessage,
}: CreatePairModalProps) {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const onFinish: FormProps<FormTypes>["onFinish"] = async (values) => {
    setIsSubmitLoading(true);
    const formmatedValues = {
      offering: `${values.from.toUpperCase()}/${values.to.toUpperCase()}`,
      type: values.type,
    };

    await axiosInstance
      .post("api/pairs", formmatedValues)
      .then((res) => {
        setIsSubmitLoading(false);
        onCancel();
        setMessage(res.data.message, "success");
        setReload();
      })
      .catch((err) => {
        setIsSubmitLoading(false);
        console.log();
        onCancel();
        setMessage(err.response.data.message, "error");
      });
  };
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      destroyOnClose
      className='max-w-xs'>
      <h1 className='font-semibold'>Create Pair</h1>
      <Divider />

      <Form
        autoComplete='off'
        onFinish={onFinish}
        layout='vertical'
        requiredMark={"optional"}
        className='max-w-xs mb-4'>
        <div className='flex justify-between items-center gap-4'>
          <Form.Item<FormTypes>
            label='Base'
            name='from'
            rules={[{ required: true, message: "Base currency not set!" }]}>
            <Input size='large' maxLength={4} />
          </Form.Item>

          <p className='text-3xl text-gray-700'>/</p>

          <Form.Item<FormTypes>
            label='Quote'
            name='to'
            rules={[{ required: true, message: "Quote currency not set!" }]}>
            <Input size='large' maxLength={4} />
          </Form.Item>
        </div>

        <Form.Item<FormTypes>
          label='Type'
          name='type'
          tooltip='On-ramp: Buy,e.g USD/BTC | Off-ramp: Sell, e.g BTC/USD | Forex: Exchange, e.g USD/EUR'
          rules={[{ required: true, message: "Type not selected!" }]}>
          <Select
            size='large'
            options={[
              { label: "On-ramp", value: "on-ramp" },
              { label: "Off-ramp", value: "off-ramp" },
              { label: "Forex", value: "forex" },
            ]}
          />
        </Form.Item>

        <Button
          loading={isSubmitLoading}
          type='primary'
          htmlType='submit'
          size='large'
          className='w-full mt-6'>
          Submit
        </Button>
      </Form>
    </Modal>
  );
}
