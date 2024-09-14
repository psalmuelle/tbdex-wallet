import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Form, FormProps, Input, Modal } from "antd";

interface CreateFiatsModalProps {
  open: boolean;
  activeWallet: string;
  handleClose: () => void;
}

interface FieldType {
  account: string;
}

export default function CreateFiatsModal({
  open,
  activeWallet,
  handleClose,
}: CreateFiatsModalProps) {

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {};

  return (
    <Modal
      footer={null}
      destroyOnClose
      onCancel={handleClose}
      open={open}
      title={`Create ${activeWallet} Account`}>
      <div className='flex gap-1 items-center'>
        <CloseCircleOutlined className='text-red-400' />
        <p>
          This app is still in development. Please, do not use your real account
          details
        </p>
      </div>
      <div>
        <Divider>Connect account</Divider>
        <Form
          requiredMark={false}
          layout='vertical'
          className='max-w-sm mx-auto mt-6'
          onFinish={onFinish}>
          <Form.Item<FieldType>
            name={"account"}
            label={"Account Number"}
            rules={[{ required: true, message: "Input your account number" }]}>
            <Input size='large' placeholder='Account Number' />
          </Form.Item>
          <Form.Item<FieldType>
            name={"account"}
            label={"Account Number"}
            rules={[{ required: true, message: "Input your account number" }]}>
            <Input size='large' placeholder='Dynamic' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Connect
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
