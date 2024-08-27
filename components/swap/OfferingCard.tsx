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
import { Offering } from "@tbdex/http-client";
import { PfiDataTypes } from "../pfi/PfiManager";
import {
  CheckCircleFilled,
  IdcardOutlined,
  QuestionCircleFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useOfferingDetails } from "@/hooks/useSwap";

interface OfferingInfoTypes {
  offeringDetails: Offering;
  pfiDetails: PfiDataTypes;
  validCredentials: boolean;
  amount: number;
  from: string;
  to: string;
  setNextStep: () => void;
}

const { Paragraph } = Typography;

export default function OfferingCard({
  offeringDetails,
  pfiDetails,
  amount,
  from,
  to,
  validCredentials,
  setNextStep,
}: OfferingInfoTypes) {
  const shortenedDid =
    pfiDetails.did.substring(0, 12) +
    "...." +
    pfiDetails.did.substring(pfiDetails.did.length - 4);
  const router = useRouter();
  const successfulOrders = pfiDetails.orders.filter(
    (order) => order.status === "success"
  ).length;
  const successRate = (successfulOrders / pfiDetails.orders.length) * 100;
  const allRatings = pfiDetails.orders.map((order) => order.rating);
  const totalRatings = allRatings.reduce((sum, rating) => sum + rating, 0);
  const averageRating = totalRatings / allRatings.length;
  const setOfferingDetails = useOfferingDetails((state) => state.setOffering);

  const handleAcceptOffer = () => {
    setOfferingDetails(offeringDetails);
    setNextStep();
  };

  return (
    <div className='bg-white rounded-xl max-w-sm p-6 max-sm:p-4 shadow'>
      <section className='flex justify-between gap-4 max-sm:flex-col max-sm:justify-center'>
        <div className='flex justify-start items-center gap-2 w-fit'>
          <Avatar
            src='https://img.icons8.com/emoji/48/bank-emoji.png'
            alt='bank-emoji'
          />
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
          <Divider
            type='vertical'
            style={{ height: "42px", borderColor: "#aaa" }}
          />
          <p>
            Estimated payout:
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
            content={
              validCredentials ? (
                <p>
                  You meet the requirements <br /> for this offering
                </p>
              ) : (
                <>
                  <p>
                    You do not meet the requirements <br /> for this offering
                  </p>
                  <Button
                    className='mt-4'
                    onClick={() => {
                      const offering = {
                        amount: amount,
                        to: to,
                        from: from,
                      };
                      localStorage.setItem(
                        "offering",
                        JSON.stringify(offering)
                      );
                      router.push(`/dashboard/kcc`);
                    }}>
                    Submit A KCC
                  </Button>
                </>
              )
            }>
            <div className='font-semibold flex gap-2 items-center w-fit cursor-pointer'>
              <IdcardOutlined />
              <p>
                Required Claims{" "}
                <span>
                  {validCredentials ? (
                    <CheckCircleFilled style={{ color: "green" }} />
                  ) : (
                    <QuestionCircleFilled style={{ color: "red" }} />
                  )}
                </span>
              </p>
            </div>
          </Popover>
        </div>
      </section>
      <Divider style={{ margin: "16px 0px" }} />
      <section className='flex justify-between gap-4 items-center'>
        <div />
        <Button
          type='primary'
          disabled={!validCredentials}
          onClick={handleAcceptOffer}>
          Accept Offer
        </Button>
      </section>
    </div>
  );
}
