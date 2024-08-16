import { TbdexHttpClient } from "@tbdex/http-client";
import axiosInstance from "../axios";

type OrderTypes = {
    pfiDid: string;
    rating: number;
    review: string;
    status: string;
    userDid: string;
    _id: string;
  };

type PfiType = {
    creator: string,
    did: string,
    isActive: boolean,
    name: string,
    orders: OrderTypes[],
    _id: string,

}




export default async function fetchPfiOfferings() {
    const listofPfis = await axiosInstance.get('/api/pfis')
    const pfis: PfiType[] = listofPfis.data.pfi
   const pfiOfferings = await TbdexHttpClient.getOfferings({pfiDid: pfis[0].did})
   console.log(pfiOfferings)
  
}