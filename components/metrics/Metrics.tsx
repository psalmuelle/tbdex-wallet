"use client";
import {
  AccountBookOutlined,
  ArrowUpOutlined,
  BankOutlined,
  DollarCircleOutlined,
  FallOutlined,
  RiseOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Card, Rate, Statistic } from "antd";

export default function Metrics() {
  return (
    <div className='my-6'>
      <h1 className='font-semibold mb-12'>Chain Wallet Metrics</h1>
      <div className='grid grid-cols-2 gap-4 max-w-4xl mx-auto'>
        <Card bordered={false} className='w-full h-[170px] col-span-2'>
          <Statistic
            className='mx-auto w-fit text-center'
            title={
              <p>
                Total Revenue <DollarCircleOutlined />
              </p>
            }
            value={11.28}
            precision={6}
            valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
            suffix='₿'
          />
          <Button className='mt-4 mx-auto block' type='primary'>
            See Transactions
          </Button>
        </Card>

        <Card bordered={false} className='w-full  h-[170px]'>
          <Statistic
            className='mx-auto w-fit text-center'
            title={
              <p>
                Number of Active PFIs <BankOutlined />
              </p>
            }
            value={4}
            precision={1}
            valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
          />
        </Card>

        <Card bordered={false} className='w-full  h-[170px]'>
          <Statistic
            className='mx-auto w-fit text-center'
            title={
              <p>
                Total Number of Orders <AccountBookOutlined />
              </p>
            }
            value={20}
            precision={1}
            valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
          />
        </Card>

        <Card bordered={false} className='w-full  h-[170px]'>
          <Statistic
            className='mx-auto w-fit text-center'
            title={
              <p>
                PFI with Highest Orders <RiseOutlined />
              </p>
            }
            value={"Aquafinace Bank"}
            valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
          />
        </Card>

        <Card bordered={false} className='w-full  h-[170px]'>
          <Statistic
            className='mx-auto w-fit text-center'
            title={
              <p>
                PFI with Lowest Orders <FallOutlined />
              </p>
            }
            value={"Osteofinace Bank"}
            valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
          />
        </Card>

        <Card bordered={false} className='w-full  h-[170px]'>
          <Statistic
            className='mx-auto w-fit text-center'
            title={
              <p>
                PFI with Highest Ratings <StarOutlined />
              </p>
            }
            value={"Aquafinace Bank"}
            valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
          />
          <Rate
            className='mt-4 mx-auto block w-fit'
            disabled
            defaultValue={4.5}
            allowHalf
          />
        </Card>

        <Card bordered={false} className='w-full h-[170px]'>
          <Statistic
            className='mx-auto w-fit text-center'
            title={
              <p>
                PFI with Lowest Ratings <StarOutlined />
              </p>
            }
            value={"Paycome Bank"}
            valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
          />
          <Rate
            className='mt-4 mx-auto block w-fit'
            disabled
            defaultValue={3}
            allowHalf
          />
        </Card>
      </div>
    </div>
  );
}
