"use client";
import { useEffect, useState } from "react";
import { BankOutlined } from "@ant-design/icons";
import { Empty, Spin } from "antd";
import axiosInstance from "@/lib/axios";
import { TbdexHttpClient } from "@tbdex/http-client";
import type { Offering } from "@tbdex/http-client";
import { PfiDataTypes } from "../pfi/PfiManager";
import { SwapFormProps } from "./SwapPairs";
import { useSwapLoading } from "@/hooks/useSwap";
import OfferingCard from "./OfferingCard";

interface OfferingInfoTypes {
  offeringDetails: Offering;
  pfiDetails: PfiDataTypes;
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
        setAvaialableOfferings([]);
        axiosInstance
          .get(`/api/pfis/?pair=${from}/${to}`)
          .then((response) => {
            if (response.data.pfi.length === 0) {
              setLoading(false);
              return;
            }
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
  }, [to, from]);

  return (
    <section className='mt-8'>
      <h1 className='font-semibold mb-6'>
        <span>
          <BankOutlined className='text-xl' />{" "}
        </span>
        Offerings
      </h1>

      <div className='text-center flex items-center flex-wrap gap-6 mt-4 mb-14'>
        {loading && <Spin className='flex justify-center items-center' />}
        {!loading &&
          availableOfferings &&
          availableOfferings.map((offering, index) => {
            return (
              <OfferingCard
                offeringDetails={offering.offeringDetails}
                pfiDetails={offering.pfiDetails}
                key={index}
                amount={Number(amount)}
              />
            );
          })}
        {!loading && availableOfferings.length === 0 && (
          <div>
            <Empty />
          </div>
        )}
      </div>
    </section>
  );
}
