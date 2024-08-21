import { DollarCircleFilled } from "@ant-design/icons";
import { Button, Divider, message, Table, Tag, Popconfirm } from "antd";
import type { TableColumnsType } from "antd";
import type { NoticeType } from "antd/es/message/interface";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import CreatePairModal from "./CreatePair";

interface DataType {
  key: React.Key;
  pair: string;
  type: string;
}

const TableColumn = (confirmDelete: (pair: string) => void) => {
  const columns: TableColumnsType<DataType> = [
    {
      title: "S/N",
      dataIndex: "key",
      rowScope: "row",
      responsive: ["md"],
    },
    {
      title: "Pair",
      dataIndex: "pair",
      sorter: (a, b) => a.pair.charCodeAt(0) - b.pair.charCodeAt(0),
    },
    {
      title: "Type",
      dataIndex: "type",
      filters: [
        {
          text: "on-ramp",
          value: "on-ramp",
        },
        {
          text: "off-ramp",
          value: "off-ramp",
        },
        {
          text: "forex",
          value: "forex",
        },
      ],
      filterSearch: true,
      onFilter: (value, record) => record.type === value,
      width: "30%",
      render(value, _record, index) {
        return (
          <Tag
            key={index}
            color={
              value == "on-ramp"
                ? "volcano"
                : value == "off-ramp"
                ? "blue"
                : "purple"
            }>
            {value}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_value, record, _index) => (
        <Popconfirm
          title='Delete this pair'
          description='Are you sure to delete this pair?'
          onConfirm={() => confirmDelete(record.pair)}
          okText='Yes'
          cancelText='No'>
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return columns;
};

export default function ManageOffers() {
  const [messageApi, contextHolder] = message.useMessage();
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataType[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const msg = (content: string, type: NoticeType) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };

  //Popconfirm Delete
  const confirmDelete = async (pair: string) => {
    try {
     await axiosInstance
        .delete("api/pairs", {
          data: {
            offering: pair,
          },
        })
        .then(() => {
          msg("Pair deleted successfully", "success");
          setReload(!reload);
        });
    } catch (error) {
      msg("Error deleting pair", "error");
    }
  };

  const onCancelModal = () => {
    setOpenCreateModal(false);
  };
  //Fetch Pairs
  useEffect(() => {
    async function fetchData() {
     await axiosInstance.get("api/pairs").then((res) => {
        const newData = res.data.pairs.map(
          (pair: { offering: string; type: string }, i: number) => ({
            key: i + 1,
            pair: pair.offering,
            type: pair.type,
          })
        );
        setData(newData);

        setIsLoading(false);
      });
    }

    fetchData();
  }, [reload]);

  return (
    <section>
      {contextHolder}
      <h1 className='font-semibold mt-6'>
        PFI Offerings Available on Chain Wallet
      </h1>
      <Button
        icon={<DollarCircleFilled />}
        type='primary'
        size='large'
        onClick={() => setOpenCreateModal(true)}
        className='mt-4'>
        Add A Pair
      </Button>
      <Divider />

      <Table
        columns={TableColumn(confirmDelete)}
        dataSource={data}
        loading={isLoading}
      />
      <CreatePairModal
        open={openCreateModal}
        onCancel={onCancelModal}
        setReload={() => setReload(!reload)}
        setMessage={(content: string, type: NoticeType) => msg(content, type)}
      />
    </section>
  );
}
