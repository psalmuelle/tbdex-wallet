"use client";
import Order from "@/components/orders/Order";
import { Button, Empty, Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import initWeb5 from "@/lib/web5/web5";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import { Web5PlatformAgent } from "@web5/agent";
import { Message, TbdexHttpClient } from "@tbdex/http-client";
import { BearerDid } from "@web5/dids";
import { Record } from "@web5/api";


const { Content } = Layout;

// function groupOrdersByDay(orders: Message[][]) {
//   return orders.reduce((groupedOrders, order) => {
//     // Extract the date from the order and format it to a readable date string (e.g., "August 4, 2023")
//     const date = format(new Date(order[1].metadata.createdAt), "MMMM d, yyyy");

//     // If the date doesn't exist in the groupedOrders object, create a new array for it
//     if (!groupedOrders[date]) {
//       groupedOrders[date] = [];
//     }

//     // Add the order to the corresponding date array
//     groupedOrders[date].push(order);

//     return groupedOrders;
//   }, {});
// }



function formatOrder(orders :Message[]){
  const formattedOrder = {
     pfiDid : orders[1].metadata.to,
   
  }
}

export default function Orders() {
  const [orders, setOrders] = useState<Message[][]>([]);
  const [polledOrders, setPolledOrders] = useState();
  const [userDid, setUserDid] = useState<BearerDid>();
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [savedRfqs, setSavedRfqs] = useState<Record[]>();
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });

  useEffect(() => {
    async function getRfqs() {
      try {
        setIsOrderLoading(true);
        const allExchanges: Message[][][] = [];
        // Initialize web5
        const { web5, userDID } = await initWeb5({ password: sessionKey });
        const userAgent = web5.agent as Web5PlatformAgent;
        const identities = await userAgent.identity.list();

        setUserDid(identities[0].did);

        // Get pfiDIDs from the dwn
        const savedRfqs = await web5.dwn.records.query({
          from: userDID,
          message: {
            filter: {
              schema: "UserExchange",
              dataFormat: "application/json",
            },
          },
        });
        if (savedRfqs.records && savedRfqs.records.length > 0) {
          setSavedRfqs(savedRfqs.records);

          savedRfqs.records.map(async (rfq, i) => {
            const Rfq = await rfq.data.json();
            const exchanges = await TbdexHttpClient.getExchanges({
              pfiDid: Rfq.pfiDID,
              did: identities[0].did,
            });
            allExchanges.push(exchanges);
            const flattenedArray = allExchanges.flat();
            setOrders(() => [...flattenedArray]);
            console.log(i);
            if (savedRfqs.records && i === savedRfqs.records.length - 1) {
              setIsOrderLoading(false);
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }

    getRfqs();
  }, []);

  // useEffect(() => {
  //   // Get Exchanges from Tbdex
  //   const getExchanges = async () => {
  //     try {
  //       console.log("Successful Indeed");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const intervalId = setInterval(getExchanges, 5000);

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <Content className='mt-8 mx-4'>
      <h1 className='text-base font-bold mb-4'>Orders</h1>
      <div className='mt-12 bg-white py-4 rounded-xl'>
        {orders.map((order) => {
          console.log(order);
          return <div>{order[1].metadata.createdAt}</div>;
        })}
        {
          (orders.length === 0 && !isOrderLoading) && (
            <Empty
            description={
              <p className="max-w-md mx-auto">You do not have any orders. Swap currencies and tokens or send crypto tokens now</p>
            }>
            <Button type="primary" size="large">Go to Swap page</Button>
            </Empty>
          )
        }

        <div className='w-fit mx-auto mt-6'>
          <Spin spinning={isOrderLoading} />
        </div>
      </div>
    </Content>
  );
}
