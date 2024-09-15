import axiosInstance from "@/lib/axios";
import { TbdexHttpClient } from "@tbdex/http-client";

interface getOfferingProps {
  from: string;
  to: string;
}

interface PfiProps {
  _id: string;
  name: string;
  did: string;
  isActive: boolean;
  pairs: string[];
}

export default async function getPfiOfferings({ from, to }: getOfferingProps) {
  console.log(from, "/", to);
  try {
    const pfiOfferings = await axiosInstance.get("/api/pfis");

    const directSend: any = [];
    const usdSend: any = {
      from: [],
      to: [],
    };
    const eurSend: any = {
      from: [],
      to: [],
    };

    for (const pfi of pfiOfferings.data.pfi) {
      const offerings = await TbdexHttpClient.getOfferings({ pfiDid: pfi.did });

      if (offerings) {
        const filteredOfferings = offerings.filter(
          (offering) =>
            offering.data.payin.currencyCode === from &&
            offering.data.payout.currencyCode === to
        );
        if (filteredOfferings.length > 0) {
          directSend.push(...filteredOfferings);
        } else {
          if (from !== "USD") {
            const fromUsd = offerings.filter(
              (offering) =>
                offering.data.payin.currencyCode === from &&
                offering.data.payout.currencyCode === "USD"
            );
            const toUsd = offerings.filter(
              (offering) =>
                offering.data.payin.currencyCode === "USD" &&
                offering.data.payout.currencyCode === to
            );
            usdSend["from"].push(...fromUsd);
            usdSend["to"].push(...toUsd);
          }
          if (from === "USD") {
            const toEur = offerings.filter(
              (offering) =>
                offering.data.payin.currencyCode === "USD" &&
                offering.data.payout.currencyCode === "EUR"
            );
            const fromEur = offerings.filter(
              (offering) =>
                offering.data.payin.currencyCode === "EUR" &&
                offering.data.payout.currencyCode === to
            );
            eurSend["from"].push(...fromEur);
            eurSend["to"].push(...toEur);
          }
        }
      }
    }

    // Return only non-empty results
    const result: any = {};

    if (directSend.length > 0) {
      result.directSend = directSend;
    }

    if (usdSend.from.length > 0 || usdSend.to.length > 0) {
      result.usdSend = usdSend;
    }

    if (eurSend.from.length > 0 || eurSend.to.length > 0) {
      result.eurSend = eurSend;
    }

    return result;
  } catch (err) {
    console.log(err);
  }
}
