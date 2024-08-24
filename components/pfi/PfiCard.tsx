import {
  CloseOutlined,
  DollarTwoTone,
  ExclamationCircleFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Modal,
  Rate,
  Select,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export type PfiCardProps = {
  name: string;
  did: string;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  successRate: number;
  ratings: number;
  isActive: boolean;
  pairs: string[];
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
  pairs,
  setReload,
}: PfiCardProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [isPfiActive, setIsPfiActive] = useState(isActive);
  const [isActionLoading, setIsActiveLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newOffering, setNewOffering] = useState<string>("");
  const [offerOptions, setOfferOptions] = useState<
    { _id: string; offering: string; type: string }[]
  >([]);
  const [offerBtnLoading, setOfferBtnLoading] = useState(false);

  useEffect(() => {
    async function fetchPairs() {
      await axiosInstance.get("api/pairs").then((res) => {
        setOfferOptions(res.data.pairs);
      });
    }
    isModalVisible && fetchPairs();
  }, [isModalVisible]);

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

  const onAddOffering = () => {
    if (newOffering) {
      setOfferBtnLoading(true);
      axiosInstance
        .put(`api/pfis`, {
          did: did,
          pair: newOffering,
        })
        .then(() => {
          messageApi.open({
            type: "success",
            content: "Offering has been added!",
          });
          setReload();
          setOfferBtnLoading(false);
        })
        .catch(() => {
          messageApi.open({
            type: "error",
            content: "Failed to add offering!",
          });
          setOfferBtnLoading(false);
        });
    } else {
      messageApi.open({
        type: "error",
        content: "Select an offer!",
      });
      setOfferBtnLoading(false);
    }
  };

  const formatSelectOptions = () => {
    const options: { label: string; value: string }[] = [];
    if (offerOptions) {
      offerOptions.map((val) => {
        const option = {
          label: val.offering,
          value: val.offering,
        };
        options.push(option);
      });

      return options;
    }
  };
  return (
    <Card actions={actions} className='min-w-[300px] max-w-xs'>
      {contextHolder}
      <Modal
        title={`Offerings From ${name}`}
        className='max-w-[350px]'
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        maskClosable={false}
        okButtonProps={{ style: { display: "none" } }}
        destroyOnClose>
        <div className='my-8 flex flex-wrap items-center gap-4'>
          {pairs &&
            pairs.map((pair, index) => {
              return (
                <Tag color='magenta' key={index}>
                  {pair}
                </Tag>
              );
            })}
        </div>
        <div className='mb-8'>
          <Select
            placeholder={"Add New Pair"}
            onSelect={(e) => setNewOffering(e.toString())}
            options={formatSelectOptions()}
          />
          <Button
            loading={offerBtnLoading}
            type='primary'
            className='ml-2'
            onClick={onAddOffering}>
            Add
          </Button>
        </div>
      </Modal>
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
              <Button
                icon={<DollarTwoTone />}
                className='w-full mb-4 font-medium'
                onClick={() => setIsModalVisible(true)}>
                Offerings
              </Button>
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
