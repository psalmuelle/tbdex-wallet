"use client";
import { useEffect, useState } from "react";
import { BankOutlined } from "@ant-design/icons";
import { Card, Spin } from "antd";
import axiosInstance from "@/lib/axios";
import { TbdexHttpClient } from "@tbdex/http-client";
import type { Offering } from "@tbdex/http-client";
import { PfiDataTypes } from "../pfi/PfiManager";
import { SwapFormProps } from "./SwapPairs";
import { useSwapLoading } from "@/hooks/useSwap";

interface OfferingInfoTypes {
  offeringDetails: Offering;
  pfiDetails: PfiDataTypes;
}

function OfferingCard() {
  return <div>This is going to be the card that will contain offer info</div>;
}

export default function Offerings({
  to,
  from,
  amount,
  swapType,
}: SwapFormProps) {
  const [availableOfferings, setAvaialableOfferings] = useState<
    OfferingInfoTypes[]
  >([]);
  const loading = useSwapLoading((state) => state.isLoading);
  const setLoading = useSwapLoading((state) => state.setIsLoading);

  useEffect(() => {
    let isSearchable = typeof to !== undefined && from !== undefined;
    if (isSearchable) {
      try {
        setLoading(true);
        axiosInstance
          .get("/api/pfis")
          .then((response) => {
            const activePfis = response.data.pfi.filter(
              (pfi: PfiDataTypes) => pfi.isActive == true
            );
            activePfis.map(async (pfi: PfiDataTypes) => {
              const offerings = await TbdexHttpClient.getOfferings({
                pfiDid: pfi.did,
              });




            

              offerings.map((offering) => {
                const payinCurrency = offering.data.payin.currencyCode;
                const payoutCurrency = offering.data.payout.currencyCode;
                if (payinCurrency === from && payoutCurrency === to) {
                  const offeringInfo: OfferingInfoTypes = {
                    offeringDetails: offering,
                    pfiDetails: pfi,
                  };
                  setAvaialableOfferings((prev) => [...prev, offeringInfo]);
                  setLoading(false);
                }
              });
            });
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  }, [to]);

  return (
    <section className='mt-8'>
      <h1 className='font-semibold mb-6'>
        <span>
          <BankOutlined className='text-xl' />{" "}
        </span>
        Offerings
      </h1>

      <div className='text-center mb-96'>
        {loading && <Spin className='flex justify-center items-center' />}
        {!loading && availableOfferings[0] && (
          <p>{availableOfferings[0].offeringDetails.data.description}</p>
        )}
        <OfferingCard />
      </div>
    </section>
  );
}
