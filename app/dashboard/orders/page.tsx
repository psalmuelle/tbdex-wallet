"use client";
import Order from "@/components/orders/Order";
import { Button, Empty, Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import initWeb5 from "@/lib/web5/web5";
import { decryptAndRetrieveData } from "@/lib/encrypt-info";
import { Web5PlatformAgent } from "@web5/agent";
import { Message, TbdexHttpClient } from "@tbdex/http-client";
import { BearerDid } from "@web5/dids";
import axiosInstance from "@/lib/axios";

const { Content } = Layout;

export default function Orders() {
  const [orders, setOrders] = useState<Message[][]>([]);
  const [orderDates, setOrderDates] = useState<Set<string>>();
  const [polledOrders, setPolledOrders] = useState();
  const [userDid, setUserDid] = useState<BearerDid>();
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });

  useEffect(() => {
    async function getQuotes() {
      try {
        setIsOrderLoading(true);

        // Initialize web5
        const { web5, userDID } = await initWeb5({ password: sessionKey });
        const userAgent = web5.agent as Web5PlatformAgent;
        const identities = await userAgent.identity.list();

        setUserDid(identities[0].did);

        // Get Dids of Pfis from backend
        await axiosInstance
          .get("/api/pfis")
          .then(async (res) => {
            if (res.data.pfi.length === 0) {
              setIsOrderLoading(false);
              return;
            }

            // Get all Exchange data
            const allExchanges: Message[][] = [];
            for (const pfi of res.data.pfi) {
              const exchanges = await TbdexHttpClient.getExchanges({
                pfiDid: pfi.did,
                did: identities[0].did,
              });

              if (exchanges.length > 0) {
                allExchanges.push(...exchanges);
              }
            }

            // Get the Dates Exchanges were carried out
            const orderDates = new Set<string>();
            allExchanges.map((order) => {
              const orderDate = order[1].metadata.createdAt;
              const date = new Date(orderDate);
              const formattedDate = date.toISOString().split("T")[0];
              setOrderDates(() => orderDates.add(formattedDate));
            });

            //Set orders
            setOrders(() => [...allExchanges]);
            setIsOrderLoading(false);
          })
          .catch((err) => {
            console.log("An error occured", err);
          });
      } catch (err) {
        console.log(err);
      }
    }

    getQuotes();
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
        {orderDates &&
          Array.from(orderDates)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map((val, i) => {
              const date = new Date(val);
              const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              const month = monthNames[date.getMonth()];
              const day = date.getDate();
              const year = date.getFullYear();
              return (
                <div className='my-4' key={i}>
                  <p className='font-semibold mx-4 mb-2'>{`${month} ${day}, ${year}`}</p>
                  {orders
                    .sort(
                      (a, b) =>
                        new Date(b[1].createdAt).getTime() -
                        new Date(a[1].createdAt).getTime()
                    )
                    .map((order) => {
                      if (
                        new Date(order[1].metadata.createdAt)
                          .toISOString()
                          .split("T")[0] === val
                      ) {
                        return (
                          <Order order={order} key={order[1].metadata.id} />
                        );
                      }
                    })}
                </div>
              );
            })}

        {orders.length === 0 && !isOrderLoading && (
          <Empty
            description={
              <p className='max-w-md mx-auto'>
                You do not have any orders. Swap currencies and tokens or send
                crypto tokens now
              </p>
            }>
            <Button type='primary' size='large'>
              Go to Swap page
            </Button>
          </Empty>
        )}

        <div className='w-fit mx-auto my-6'>
          <Spin spinning={isOrderLoading} />
        </div>
      </div>
    </Content>
  );
}
