import { Avatar, Modal, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BankOutlined, SyncOutlined } from "@ant-design/icons";

interface FundFiatProps {
  activeWallet: string;
  open: boolean;
  acctInfo: any;
  handleClose: () => void;
}

export default function FundFiatModal({
  activeWallet,
  open,
  acctInfo,
  handleClose,
}: FundFiatProps) {
  const [steps, setSteps] = useState<number>(0);
  const [topupMethod, setTopupMethod] = useState<number>();
  const router = useRouter();

  useEffect(() => {
    if (topupMethod === 1) {
      router.push(`/dashboard/convert?to=${activeWallet}`);
    }
  }, [steps, topupMethod]);

  console.log(acctInfo);
  return (
    <Modal
      footer={null}
      open={open}
      onCancel={() => {
        handleClose();
        setSteps(0);
        setTopupMethod(undefined);
      }}
      destroyOnClose
      title={`Fund ${activeWallet} Account`}>
      <div>
        <p>Top up your {activeWallet} account</p>
      </div>
      <div className='mt-6 mb-12'>
        {steps === 0 && (
          <div>
            <div
              onClick={() => {
                setTopupMethod(0);
                setSteps(1);
              }}
              className='flex justify-center items-center gap-4 w-full cursor-pointer border rounded-xl p-2 hover:bg-neutral-100 transition-all ease-in min-h-[84px]'>
              <div className='min-w-8'>
                <Avatar
                  style={{ backgroundColor: "#1677ff" }}
                  icon={<BankOutlined />}
                />
              </div>
              <div className='text-neutral-700'>
                <h2 className='font-semibold'>Add via bank transfer</h2>
                <p>
                  Fund your account by sending money to your {activeWallet} bank
                  account
                </p>
              </div>
            </div>

            <Spin spinning={topupMethod === 1}>
              <div
                onClick={() => {
                  setTopupMethod(1);
                }}
                className='flex justify-center items-center gap-4 w-full cursor-pointer border rounded-xl p-2 hover:bg-neutral-100 transition-all ease-in min-h-[84px] mt-4'>
                <div className='min-w-8'>
                  <Avatar
                    style={{ backgroundColor: "#1677ff" }}
                    icon={<SyncOutlined />}
                  />
                </div>
                <div className='text-neutral-700'>
                  <h2 className='font-semibold'>Add via conversion</h2>
                  <p>
                    convert funds from another balance to your {activeWallet}{" "}
                    bank account
                  </p>
                </div>
              </div>
            </Spin>
          </div>
        )}

        {topupMethod === 0 && steps === 1 && (
          <div>
            <p>Make transfer to your account details below</p>
            <div className='mt-6 px-4'>
              <table className='w-full'>
                <tbody>
                  <tr className='h-9'>
                    <td className='font-medium'>Account Type</td>
                    <td>
                      <Typography.Paragraph
                        style={{ marginBottom: "0px" }}
                        copyable>
                        {activeWallet}
                      </Typography.Paragraph>
                    </td>
                  </tr>
                  <tr className='h-9'>
                    <td className='font-medium'>Account Number</td>
                    <td>
                      <Typography.Paragraph
                        style={{ marginBottom: "0px" }}
                        copyable>
                        {
                          acctInfo.find(
                            (info: any) => info.accountType === activeWallet
                          ).accountNumber
                        }
                      </Typography.Paragraph>
                    </td>
                  </tr>
                  {activeWallet === "USD" && (
                    <tr className='h-9'>
                      <td className='font-medium'>Routing Number</td>
                      <td>
                        <Typography.Paragraph
                          style={{ marginBottom: "0px" }}
                          copyable>
                          {
                            acctInfo.find(
                              (info: any) => info.accountType === activeWallet
                            ).routingNumber
                          }
                        </Typography.Paragraph>
                      </td>
                    </tr>
                  )}
                  {activeWallet === "EUR" && (
                    <tr className='h-9'>
                      <td className='font-medium'>IBAN</td>
                      <td>
                        <Typography.Paragraph
                          style={{ marginBottom: "0px" }}
                          copyable>
                          {
                            acctInfo.find(
                              (info: any) => info.accountType === activeWallet
                            ).iban
                          }
                        </Typography.Paragraph>
                      </td>
                    </tr>
                  )}
                  {activeWallet === "KES" && (
                    <tr className='h-9'>
                      <td className='font-medium'>Swift Code</td>
                      <td>
                        <Typography.Paragraph
                          style={{ marginBottom: "0px" }}
                          copyable>
                          {
                            acctInfo.find(
                              (info: any) => info.accountType === activeWallet
                            ).swiftCode
                          }
                        </Typography.Paragraph>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
