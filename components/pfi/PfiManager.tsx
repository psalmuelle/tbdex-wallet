import { BankOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Spin,
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
type OrderTypes = {
  pfiDid: string;
  rating: number;
  review: string;
  status: string;
  userDid: string;
  _id: string;
};
export type PfiDataTypes = {
  name: string;
  did: string;
  creator: string;
  _id: string;
  orders: OrderTypes[];
  isActive: boolean;
  pairs: string[];
};

export default function PfiManager({
  pfis,
  isPfiLoading,
  userDid,
  setReload,
}: {
  userDid: string;
  pfis: PfiDataTypes[];
  isPfiLoading: boolean;
  setReload: () => void;
}) {
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
    const data = {
      name: values.name,
      did: values.did,
      creator: userDid,
    };
    await axiosInstance
      .post("/api/pfis", data)
      .then((res) => {
        msg(res.data.message, "success");
        handleCloseModal();
        setReload();
      })
      .catch((err) => {
        console.log(err);
        msg("An error occured", "error");
      });
  };

  return (
    <section>
      {contextHolder}
      <div className='flex justify-between my-6 gap-4'>
        <h1 className='font-semibold'>
          Participating Financial Institutions on Chain Wallet
        </h1>
        <div className='flex flex-col justify-start items-center'>
          <Button
            icon={<SyncOutlined />}
            content='Refresh'
            shape='circle'
            type='dashed'
            onClick={() => setReload()}
          />
          <p>Refresh</p>
        </div>
      </div>
      <Flex gap={"middle"} wrap className='mt-8 max-md:justify-center'>
        {isPfiLoading && (
          <Spin size='large' className='min-w-[300px] max-w-xs' />
        )}
        {!isPfiLoading &&
          pfis &&
          pfis.length > 0 &&
          pfis.map((val, id) => {
            const successfulOrders = val.orders.filter(
              (order) => order.status === "success"
            ).length;
            const failedOrders = val.orders.filter(
              (order) => order.status === "failed"
            ).length;
            const successRate = (successfulOrders / val.orders.length) * 100;
            const allRatings = val.orders.map((order) => order.rating);
            const totalRatings = allRatings.reduce(
              (sum, rating) => sum + rating,
              0
            );
            const averageRating = totalRatings / allRatings.length;
            return (
              <PfiCard
                key={id}
                name={val.name}
                did={val.did}
                totalOrders={val.orders.length}
                successfulOrders={successfulOrders}
                failedOrders={failedOrders}
                isActive={val.isActive}
                successRate={Math.round(successRate * 10) / 10}
                ratings={averageRating}
                setReload={() => setReload()}
                pairs={val.pairs}
              />
            );
          })}
        {!isPfiLoading && pfis && pfis.length === 0 && (
          <Empty className='min-w-[300px] max-w-xs' />
        )}
        <Button
          icon={<BankOutlined />}
          className='h-[305px] min-w-[300px] max-w-xs font-medium'
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
        className='max-w-[350px]'>
        <h1 className='font-semibold'>Add a new PFI</h1>
        <Divider />
        <Form
          autoComplete='off'
          onFinish={onFinish}
          layout='vertical'
          requiredMark={"optional"}
          className='mb-4'>
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
