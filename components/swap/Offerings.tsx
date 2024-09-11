"use client";
import { useEffect, useState } from "react";
import { Empty, Spin } from "antd";
import axiosInstance from "@/lib/axios";
import { TbdexHttpClient } from "@tbdex/http-client";
import type { Offering } from "@tbdex/http-client";
import { PfiDataTypes } from "../pfi/PfiManager";
import { useSwapLoading, useSwapForm } from "@/hooks/useSwap";
import OfferingCard from "./OfferingCard";
import { PresentationExchange } from "@web5/credentials";

interface OfferingInfoTypes {
  offeringDetails: Offering;
  pfiDetails: PfiDataTypes;
  validCredentials: boolean;
}

type OfferingsProps = {
  credentials: string[];
  setNextStep: () => void;
};

export default function Offerings({
  credentials,
  setNextStep,
}: OfferingsProps) {
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

        await axiosInstance
          .get(`/api/pfis/?pair=${swapFormValues.from}/${swapFormValues.to}`)
          .then(async (response) => {
            if (response.data.pfi.length === 0) {
              setLoading(false);
              return;
            }
            const activePfis: PfiDataTypes[] = response.data.pfi.filter(
              (pfi: PfiDataTypes) => pfi.isActive == true
            );
            const allOfferings: Offering[] = [];

            for (const pfi of activePfis) {
              const offerings = await TbdexHttpClient.getOfferings({
                pfiDid: pfi.did,
              });
              if (offerings.length === 0) {
                setLoading(false);
                return;
              }
              allOfferings.push(...offerings);
            }

            const availableOfferings: OfferingInfoTypes[] = [];
            allOfferings.map((offering) => {
              const payinCurrency = offering.data.payin.currencyCode;
              const payoutCurrency = offering.data.payout.currencyCode;
              if (
                payinCurrency === swapFormValues.from &&
                payoutCurrency === swapFormValues.to
              ) {
                const presentationDefinition = offering.data.requiredClaims;

                const pfi = activePfis.find((val) => val.did === offering.from);
                try {
                  PresentationExchange.satisfiesPresentationDefinition({
                    vcJwts: credentials,
                    presentationDefinition: presentationDefinition!,
                  });
                  const offeringInfo: OfferingInfoTypes = {
                    offeringDetails: offering,
                    pfiDetails: pfi!,
                    validCredentials: true,
                  };
                  availableOfferings.push(offeringInfo);
                  setAvaialableOfferings((_prev) => [...availableOfferings]);
                } catch (err) {
                  const offeringInfo: OfferingInfoTypes = {
                    offeringDetails: offering,
                    pfiDetails: pfi!,
                    validCredentials: false,
                  };
                  availableOfferings.push(offeringInfo);
                  setAvaialableOfferings((_prev) => [...availableOfferings]);
                }
              }
            });
            setLoading(false);
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
  }, [credentials]);

  return (
    <section className='mt-8'>
      <div className='w-fit p-2 px-4 font-semibold'>
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
                validCredentials={offering.validCredentials}
                key={index}
                from={swapFormValues.from}
                to={swapFormValues.to}
                amount={Number(swapFormValues.amount)}
                setNextStep={setNextStep}
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
