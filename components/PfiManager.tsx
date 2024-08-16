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
import { useState, useEffect } from "react";
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
type PfiData = {
  name: string;
  did: string;
  creator: string;
  _id: string;
  orders: OrderTypes[];
  isActive: boolean;
};

export default function PfiManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [pfis, setPfis] = useState<PfiData[]>([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchPfis = async () => {
      await axiosInstance.get("api/pfis").then((res) => {
        setPfis(res.data.pfi);
      });
    };
    fetchPfis();
  }, [reload]);

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
      <div className='flex justify-between my-6'>
        <h1 className='font-semibold'>
          Participating Financial Institutions on Chain Wallet
        </h1>
        <Button
          icon={<SyncOutlined />}
          shape='circle'
          type='dashed'
          onClick={() => setReload(!reload)}
        />
      </div>
      <Flex gap={"middle"} wrap className='mt-8'>
        {pfis && pfis.length > 0 ? (
          pfis.map((val, id) => {
            const shortenedDID =
              val.did.substring(0, 12) +
              "...." +
              val.did.substring(val.did.length - 4);
            const successfulOrders = val.orders.filter(
              (order) => order.status === "success"
            ).length;
            const failedOrders = val.orders.filter(
              (order) => order.status === "failed"
            ).length;
            const successRate = (successfulOrders / val.orders.length) * 100;

            // Step 1: Extract all ratings
            const allRatings = val.orders.map((order) => order.rating);
            // Step 2: Sum up all the ratings
            const totalRatings = allRatings.reduce(
              (sum, rating) => sum + rating,
              0
            );
            // Step 3: Calculate the average rating
            const averageRating = totalRatings / allRatings.length;
            return (
              <PfiCard
                key={id}
                name={val.name}
                did={shortenedDID}
                totalOrders={val.orders.length}
                successfulOrders={successfulOrders}
                failedOrders={failedOrders}
                isActive={val.isActive}
                successRate={Math.round(successRate * 10) / 10}
                ratings={averageRating}
              />
            );
          })
        ) : pfis && pfis.length === 0 ? (
          <Spin size='large' className='min-w-[300px] max-w-xs' />
        ) : (
          <Empty />
        )}
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
