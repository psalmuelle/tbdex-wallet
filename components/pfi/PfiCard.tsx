import {
  CloseOutlined,
  ExclamationCircleFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Divider,
  Modal,
  Rate,
  Spin,
  Typography,
  message,
} from "antd";
import axiosInstance from "@/lib/axios";
import { useState } from "react";

export type PfiCardProps = {
  name: string;
  did: string;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  successRate: number;
  ratings: number;
  isActive: boolean;
  setReload: () => void;
};

const { Paragraph } = Typography;
const { confirm } = Modal;

export default function PfiCard({
  name,
  did,
  totalOrders,
  successRate,
  successfulOrders,
  failedOrders,
  isActive,
  ratings,
  setReload,
}: PfiCardProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [isPfiActive, setIsPfiActive] = useState(isActive);
  const [isActionLoading, setIsActiveLoading] = useState(false);

  const deletePFI = async () => {
    try {
      await axiosInstance.delete(`api/pfis`, {
        data: {
          did: did,
        },
      });
      messageApi.open({
        type: "success",
        content: "PFI has been deleted!",
      });
      setReload();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Failed to delete PFI",
      });
      message.error("Failed to delete PFI");
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete this PFI?",
      icon: <ExclamationCircleFilled />,
      content: (
        <p>
          Delete "{<span className='font-semibold'>{name}</span>}" from List of
          PFIs
        </p>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        await deletePFI();
      },
    });
  };

  const TogglePfiStatus = async () => {
    setIsActiveLoading(true);
    try {
      await axiosInstance.put(`api/pfis`, {
        did: did,
        isActive: !isPfiActive,
      });
      setIsPfiActive(!isPfiActive);
      messageApi.open({
        type: "success",
        content: `PFI has been ${isPfiActive ? "deactivated" : "activated"}!`,
      });
      setIsActiveLoading(false);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: `Failed to ${isPfiActive ? "deactivate" : "activate"} PFI`,
      });
      message.error(`Failed to ${isPfiActive ? "deactivate" : "activate"} PFI`);
      setIsActiveLoading(false);
    }
  };

  const actions: React.ReactNode[] = [
    isActionLoading ? (
      <Spin />
    ) : isPfiActive ? (
      <EyeOutlined
        disabled
        style={{ color: "green" }}
        onClick={async () => TogglePfiStatus()}
      />
    ) : (
      <EyeInvisibleOutlined
        style={{ color: "red" }}
        onClick={async () => TogglePfiStatus()}
      />
    ),
    <CloseOutlined key='delete' onClick={showDeleteConfirm} />,
  ];
  const shortenedDid =
    did.substring(0, 12) + "...." + did.substring(did.length - 4);

  return (
    <Card actions={actions} className='min-w-[300px] max-w-xs'>
      {contextHolder}
      <Card.Meta
        avatar={
          <Avatar src='https://api.dicebear.com/9.x/thumbs/svg?seed=Cuddles' />
        }
        title={name}
        description={
          <>
            <Paragraph copyable={{ text: did }}>{shortenedDid}</Paragraph>
            <Divider />
            <div className='text-gray-700 font-medium'>
              <p>
                Total Orders:{" "}
                <span className='font-semibold'>{totalOrders}</span>
              </p>
              <p>
                Succesful orders:{" "}
                <span className='text-green-500'>{successfulOrders}</span>
              </p>
              <p>
                Failed orders:{" "}
                <span className='text-red-500'>{failedOrders}</span>
              </p>
              <p>Success Rate: {successRate ? successRate : 0}%</p>
              <p>
                <span className='text-sm font-medium'>Ratings: </span>{" "}
                <Rate
                  disabled
                  defaultValue={ratings}
                  allowHalf
                  className='text-base'
                />
              </p>
            </div>
          </>
        }
      />
    </Card>
  );
}
