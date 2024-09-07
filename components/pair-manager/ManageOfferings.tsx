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

export default function ManageOffers({
  pairs,
  setReload,
  isPairLoading,
}: {
  pairs: any;
  setReload: () => void;
  isPairLoading: boolean;
}) {
  const [messageApi, contextHolder] = message.useMessage();
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
          setReload();
        });
    } catch (error) {
      msg("Error deleting pair", "error");
    }
  };

  const onCancelModal = () => {
    setOpenCreateModal(false);
  };

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
        dataSource={pairs}
        loading={isPairLoading}
      />
      <CreatePairModal
        open={openCreateModal}
        onCancel={onCancelModal}
        setReload={() => setReload()}
        setMessage={(content: string, type: NoticeType) => msg(content, type)}
      />
    </section>
  );
}
