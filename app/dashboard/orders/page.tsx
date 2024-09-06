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
import { useSearchParams } from "next/navigation";
import { SyncOutlined } from "@ant-design/icons";
import type { Web5 } from "@web5/api";

const { Content } = Layout;

export default function Orders() {
  const [orders, setOrders] = useState<Message[][]>([]);
  const [orderDates, setOrderDates] = useState<Set<string>>();
  const [userDid, setUserDid] = useState<BearerDid>();
  const [web5, setWeb5] = useState<Web5>();
  const [reload, setReload] = useState(false);
  const [pfis, setPfis] = useState([]);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const sessionKey = decryptAndRetrieveData({ name: "sessionKey" });
  const [searchParamsId, setSearchParamsId] = useState<string>("");
  const searchParams = useSearchParams();

  const handleReloadClick = () => {
    setReload(!reload);
  };

  useEffect(() => {
    // Get search Params from URI
    const id = searchParams.get("id");
    if (id) {
      setSearchParamsId(id);
    }

    async function initweb5() {
      // Initialize web5
      const { web5, userDID } = await initWeb5({ password: sessionKey });
      const userAgent = web5.agent as Web5PlatformAgent;
      const identities = await userAgent.identity.list();

      setUserDid(identities[0].did);
      setWeb5(web5);

      // Get Pfi Info From Backend
      await axiosInstance.get("/api/pfis").then((res) => {
        setPfis(res.data.pfi);
      });
    }
    initweb5();
  }, []);

  useEffect(() => {
    async function getQuotes() {
      try {
        setIsOrderLoading(true);

        // Get all Exchange data
        const allExchanges: Message[][] = [];
        if (userDid && web5 && orders.length === 0) {
          const { records } = await web5.dwn.records.query({
            message: {
              filter: {
                schema: "UserExchange",
                dataFormat: "application/json",
              },
            },
          });

          for (const record of records ?? []) {
            await record.data.json().then(async (res) => {
              const exchange = await TbdexHttpClient.getExchange({
                exchangeId: res.exchangeId,
                pfiDid: res.pfiDID,
                did: userDid,
              });

              allExchanges.push(exchange);
            });
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
        } else if (web5 && userDid && orders.length > 0) {
          const updatedOrders = await Promise.all(
            orders.map(async (order) => {
              if (order[order.length - 1].kind === "close") {
                return order;
              } else {
                const exchange = await TbdexHttpClient.getExchange({
                  exchangeId: order[1].metadata.exchangeId,
                  pfiDid: order[1].metadata.from,
                  did: userDid,
                });
                return exchange;
              }
            })
          );
          setOrders(updatedOrders);
          setIsOrderLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getQuotes();
  }, [userDid, reload]);

  return (
    <Content className='mt-8 mx-4'>
      <div className='flex justify-between gap-4 items-center'>
        <h1 className='text-base font-bold mb-4'>Orders</h1>
        <Button
          className='md:mr-8'
          onClick={handleReloadClick}
          shape={"circle"}
          icon={<SyncOutlined spin={isOrderLoading} />}
        />
      </div>
      <div className='mt-12 bg-white py-4 rounded-xl'>
        {orderDates &&
          !isOrderLoading &&
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
                  <p className='font-semibold mx-4 mb-2'>
                    {`${month} ${day}, ${year}`}
                  </p>
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
                          <Order
                            pfis={pfis}
                            web5={web5!}
                            searchParamsId={searchParamsId}
                            userDid={userDid!}
                            date={`${month.slice(0, 3)} ${day}, ${year}`}
                            order={order}
                            setReload={() => setReload(true)}
                            key={order[1].metadata.id}
                          />
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
