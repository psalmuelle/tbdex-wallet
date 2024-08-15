import { CloseOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Avatar, Card, Divider, Rate } from "antd";


export default function PfiCard() {
    const actions: React.ReactNode[] = [
      <EyeInvisibleOutlined key='active' />,
      <CloseOutlined key='delete' />,
    ];
    return (
      <Card actions={actions} className='min-w-[300px] max-w-xs'>
        <Card.Meta
          avatar={
            <Avatar src='https://api.dicebear.com/9.x/glass/svg?seed=Miss%20kitty' />
          }
          title='Abari Microfinance Bank'
          description={
            <>
              <p>did:dht:akkl...askd</p>
              <Divider />
              <div className='text-gray-700 font-medium'>
                {/* <EyeOutlined /> */}
                <p>
                  Total Orders: <span className='font-semibold'>1001</span>
                </p>
                <p>
                  Succesful orders: <span className='text-green-500'>100</span>
                </p>
                <p>
                  Failed orders: <span className='text-red-500'>12</span>
                </p>
                <p>Success Rate: 80%</p>
                <p>
                  <span className='text-sm font-medium'>Ratings: </span>{" "}
                  <Rate
                    disabled
                    defaultValue={3.5}
                    allowHalf
                    className='text-base'
                  />
                </p>
              </div>
            </>
          }
        />
      </Card>
    );
  }