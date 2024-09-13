import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Spin } from "antd";

function AccountType({
  type,
  logo,
  isActive,
  handleClick,
}: {
  type: string;
  logo: string;
  isActive: boolean;
  handleClick: () => void;
}) {
  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-center transition-all ease-in rounded-xl px-1.5 py-2 text-base cursor-pointer ${
        isActive ? "font-semibold bg-white" : ""
      }`}>
      <Avatar size={"small"} shape={"circle"} src={logo} />
      <p>{type}</p>
    </div>
  );
}

interface WalletsProps {
  balance: number | undefined;
  balances: {
    id: string;
    type: string;
    logo: string;
  }[];
  activeBalance: string;
  loadingBalance: boolean;
  handleActiveBalance: (type: string) => void;
  handleFundWallet: () => void;
  handleSendMoney: () => void;
  handleCreateAccount: () => void;
}

export default function Wallets({
  balances,
  balance,
  activeBalance,
  loadingBalance,
  handleActiveBalance,
  handleFundWallet,
  handleSendMoney,
  handleCreateAccount,
}: WalletsProps) {
  const balanceSigns: { [key: string]: string } = {
    EUR: "€",
    USD: "$",
    KES: "Ksh",
  };

  return (
    <section className='p-4 mt-4 bg-white rounded-xl w-full'>
      <h1 className='font-semibold my-4'>My Balances</h1>
      <div className='border rounded-xl p-4 mt-4 min-h-[275px]'>
        <div className='w-fit flex justify-center items-center gap-2.5 mt-4 rounded-xl bg-neutral-100 p-1 mx-auto'>
          {balances.map((balance) => (
            <AccountType
              key={balance.id}
              type={balance.type}
              logo={balance.logo}
              handleClick={() => handleActiveBalance(balance.type)}
              isActive={balance.type === activeBalance}
            />
          ))}
        </div>

        {loadingBalance && (
          <div className='my-10 w-fit mx-auto'>
            <Spin spinning={loadingBalance} />
          </div>
        )}

        {!loadingBalance && balance === undefined ? (
          <div className='mt-6'>
            <h2 className='text-center mt-2 font-medium text-neutral-500'>
              You've not created your {activeBalance} Account
            </h2>
            <div className='w-fit mx-auto mt-4'>
              <Avatar
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #f87171",
                }}
                size={32}
                icon={<CloseCircleOutlined className='text-red-400' />}
              />
            </div>
            <Button
              onClick={handleCreateAccount}
              size='large'
              className='text-sm font-medium block mx-auto mt-4'>
              Create {activeBalance} Account
            </Button>
          </div>
        ) : (
          !loadingBalance &&
          balance !== undefined && (
            <div className='mt-6'>
              <h2 className='text-center mt-2 font-medium text-neutral-500'>
                Available {activeBalance} Balance <CheckCircleOutlined />
              </h2>
              <div>
                <p className='font-bold text-3xl text-neutral-900 text-center my-2'>
                  {balanceSigns[activeBalance]} {balance}{" "}
                  {activeBalance === "BTC" && "₿"}
                </p>
              </div>
              <div className='w-fit mx-auto text-medium mt-8 mb-4 flex justify-center items-center gap-3'>
                <Button
                  className='text-sm'
                  size='large'
                  onClick={handleFundWallet}
                  iconPosition={"end"}
                  icon={<PlusCircleOutlined />}>
                  Fund Wallet
                </Button>
                <Button
                  onClick={handleSendMoney}
                  className='text-sm'
                  size='large'
                  iconPosition={"end"}
                  icon={<SendOutlined />}>
                  Send Money
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
