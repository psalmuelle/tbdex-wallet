import { Card, Rate, Skeleton, Statistic } from "antd";


export default function MetricCard({
    value,
    title,
    rating,
    loading,
  }: {
    value: string | number;
    title: React.ReactNode;
    rating?: number;
    loading: boolean;
  }) {
    return (
      <Card bordered={false} className='w-full  min-h-[170px]'>
        {loading ? (
          <div>
            <Skeleton active />
          </div>
        ) : (
          <div>
            <Statistic
              className='mx-auto w-fit text-center'
              title={title}
              value={value}
              valueStyle={{ marginTop: "16px", fontWeight: "bold" }}
            />
            {rating && (
              <Rate
                className='mt-4 mx-auto block w-fit'
                disabled
                defaultValue={rating}
                allowHalf
              />
            )}
          </div>
        )}
      </Card>
    );
  }