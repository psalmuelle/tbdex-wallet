import { BankOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  message,
  Modal,
} from "antd";
import type { NoticeType } from "antd/es/message/interface";
import type { FormProps } from "antd";
import { useState } from "react";
import PfiCard from "./PfiCard";
import axiosInstance from "@/lib/axios";

type PfiFormProps = {
  name: string;
  did: string;
};

export default function PfiManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitLoading(false);
  };
  const msg = (content: string, type: NoticeType) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };
  const onFinish: FormProps<PfiFormProps>["onFinish"] = async (values) => {
    setIsSubmitLoading(true);
    await axiosInstance
      .post("/api/pfis", values)
      .then((res) => {
        msg(res.data.message, "success");
        handleCloseModal();
      })
      .catch((err) => {
        console.log(err);
        msg("An error occured", "error");
      });
  };

  return (
    <section>
      {contextHolder}
      <h1 className='font-semibold my-4'>
        Participating Financial Institutions on Chain Wallet
      </h1>
      <Flex gap={"middle"} wrap>
        {/* <Empty /> */}
        <PfiCard />
        <PfiCard />
        <PfiCard />
        <PfiCard />
        <Button
          icon={<BankOutlined />}
          className='h-64 min-w-[300px] max-w-xs font-medium'
          type='dashed'
          onClick={handleOpenModal}>
          Add new PFI
        </Button>
      </Flex>

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        maskClosable={false}
        destroyOnClose
        className='max-w-xs'>
        <h1 className='font-semibold'>Add a new PFI</h1>
        <Divider />
        <Form
          autoComplete='off'
          onFinish={onFinish}
          layout='vertical'
          className='max-w-xs mb-4'>
          <Form.Item<PfiFormProps>
            label='Name of PFI'
            name='name'
            rules={[{ required: true, message: "PFI name is required!" }]}>
            <Input size='large' />
          </Form.Item>

          <Form.Item<PfiFormProps>
            label='DID of PFI'
            name='did'
            rules={[{ required: true, message: "DID is required!" }]}>
            <Input size='large' />
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
  );
}
