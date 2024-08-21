"use client";
import {
  Typography,
  Avatar,
  Rate,
  Divider,
  Popover,
  Tooltip,
  Button,
} from "antd";
import type { Offering } from "@tbdex/http-client";
import { PfiDataTypes } from "../pfi/PfiManager";
import { IdcardOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface OfferingInfoTypes {
  offeringDetails: Offering;
  pfiDetails: PfiDataTypes;
  amount: number;
}

const { Paragraph } = Typography;

export default function OfferingCard({
  offeringDetails,
  pfiDetails,
  amount,
}: OfferingInfoTypes) {
  const shortenedDid =
    pfiDetails.did.substring(0, 12) +
    "...." +
    pfiDetails.did.substring(pfiDetails.did.length - 4);

  const successfulOrders = pfiDetails.orders.filter(
    (order) => order.status === "success"
  ).length;
  const successRate = (successfulOrders / pfiDetails.orders.length) * 100;
  const allRatings = pfiDetails.orders.map((order) => order.rating);
  const totalRatings = allRatings.reduce((sum, rating) => sum + rating, 0);
  const averageRating = totalRatings / allRatings.length;

  return (
    <div className='bg-white rounded-xl max-w-sm p-6 max-sm:p-4 shadow'>
      <section className='flex justify-between gap-4'>
        <div className='flex justify-start items-center gap-2 w-fit'>
          <Avatar src='https://api.dicebear.com/9.x/glass/svg?seed=Shadow' />
          <div className='text-left flex items-start flex-col gap-0.5'>
            <h1 className='font-medium'>{pfiDetails.name}</h1>
            <Paragraph
              style={{ marginBottom: "0px" }}
              copyable={{ text: pfiDetails.did }}>
              {shortenedDid}
            </Paragraph>
          </div>
        </div>
        <div className='text-left'>
          <p>
            {pfiDetails.orders.length} Orders | {successRate || 0}%
          </p>
          <Rate
            disabled
            defaultValue={averageRating}
            allowHalf
            className='text-xs'
            style={{ fontSize: "15px" }}
          />
        </div>
      </section>
      <Divider style={{ margin: "16px 0px" }} />
      <section className='text-left'>
        <p className='font-semibold text-left'>
          {offeringDetails.data.description}
        </p>

        <div className='flex justify-between gap-4 mt-4'>
          <p>
            1{offeringDetails.data.payin.currencyCode} ➩{" "}
            {offeringDetails.data.payoutUnitsPerPayinUnit}
            {offeringDetails.data.payout.currencyCode}
          </p>
          <p>
            Estimated rate:
            <span className='font-bold block'>
              {parseFloat(
                (
                  amount * Number(offeringDetails.data.payoutUnitsPerPayinUnit)
                ).toFixed(5)
              )}{" "}
              {offeringDetails.data.payout.currencyCode}
            </span>
          </p>
        </div>
        <div className='mt-4'>
          <Popover
            title='Known Customer Credentials'
            content={<div>Info about the required claims</div>}>
            <div className='font-semibold flex gap-2 items-center w-fit cursor-pointer'>
              <IdcardOutlined />
              <p>
                Required Claims{" "}
                <span>
                  <QuestionCircleOutlined />
                </span>
              </p>
            </div>
          </Popover>
        </div>
      </section>
      <Divider style={{ margin: "16px 0px" }} />
      <section className='flex justify-between gap-4 items-center'>
        <div className='flex justify-start gap-1 items-center'>
          <Tooltip title={"Pay-in payment method"}>
            <p className='cursor-auto'>
              {offeringDetails.data.payin.methods[0].kind.toLowerCase()}
            </p>
          </Tooltip>
          <p>|</p>
          <Tooltip title={"Pay-out payment method"}>
            <p className='cursor-auto'>
              {offeringDetails.data.payout.methods[0].kind.toLowerCase()}
            </p>
          </Tooltip>
        </div>
        <Button type='primary'>Accept Offer</Button>
      </section>
    </div>
  );
}
