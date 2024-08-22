"use client";
import { useEffect, useState } from "react";
import { Empty, Spin } from "antd";
import axiosInstance from "@/lib/axios";
import { TbdexHttpClient } from "@tbdex/http-client";
import type { Offering } from "@tbdex/http-client";
import { PfiDataTypes } from "../pfi/PfiManager";
import { useSwapLoading, useSwapForm } from "@/hooks/useSwap";
import OfferingCard from "./OfferingCard";

interface OfferingInfoTypes {
  offeringDetails: Offering;
  pfiDetails: PfiDataTypes;
}

export default function Offerings() {
  const [availableOfferings, setAvaialableOfferings] = useState<
    OfferingInfoTypes[]
  >([]);
  const loading = useSwapLoading((state) => state.isLoading);
  const setLoading = useSwapLoading((state) => state.setIsLoading);
  const swapFormValues = useSwapForm((state) => state.swapForm);

  useEffect(() => {
    const handleGetOfferings = async () => {
      try {
        setLoading(true);
        setAvaialableOfferings([]);
        await axiosInstance
          .get(`/api/pfis/?pair=${swapFormValues.from}/${swapFormValues.to}`)
          .then((response) => {
            if (response.data.pfi.length === 0) {
              setLoading(false);
              return;
            }
            const activePfis = response.data.pfi.filter(
              (pfi: PfiDataTypes) => pfi.isActive == true
            );
            const allOfferings: OfferingInfoTypes[] = [];
            activePfis.map(async (pfi: PfiDataTypes) => {
              const offerings = await TbdexHttpClient.getOfferings({
                pfiDid: pfi.did,
              });

              offerings.map((offering) => {
                const payinCurrency = offering.data.payin.currencyCode;
                const payoutCurrency = offering.data.payout.currencyCode;
                if (
                  payinCurrency === swapFormValues.from &&
                  payoutCurrency === swapFormValues.to
                ) {
                  const offeringInfo: OfferingInfoTypes = {
                    offeringDetails: offering,
                    pfiDetails: pfi,
                  };

                  allOfferings.push(offeringInfo);
                  setAvaialableOfferings((_prev) => [...allOfferings]);
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
    };
    handleGetOfferings();
  }, []);

  return (
    <section className='mt-10'>
      <div>
        {swapFormValues.amount} {swapFormValues.from} ➩ {swapFormValues.to}
      </div>
      <div className='text-center flex items-center justify-center flex-wrap gap-6 mt-4 mb-14'>
        {loading && <Spin className='flex justify-center items-center' />}
        {!loading &&
          availableOfferings &&
          availableOfferings.map((offering, index) => {
            return (
              <OfferingCard
                offeringDetails={offering.offeringDetails}
                pfiDetails={offering.pfiDetails}
                key={index}
                amount={Number(swapFormValues.amount)}
              />
            );
          })}
        {!loading && availableOfferings.length === 0 && (
          <div className='flex justify-center items-center'>
            <Empty />
          </div>
        )}
      </div>
    </section>
  );
}
