import { SmileOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, Modal, Result, Select } from "antd";

interface CreateKccFormProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  formStep: number;
  onFinish: ((values: FormProps) => void) | undefined;
  countries: {
    label: string;
    value: string;
  }[];
  isSubmitLoading: boolean;
  handleOk: () => void;
}

type FormProps = {
  countryCode: string;
  customerName: string;
};

export default function CreateKccForm({
  isModalOpen,
  formStep,
  countries,
  isSubmitLoading,
  handleCloseModal,
  onFinish,
  handleOk,
}: CreateKccFormProps) {
  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      maskClosable={false}
      destroyOnClose
      className='max-w-[350px]'>
      <h1 className='font-semibold'>Create your Known Customer Credential</h1>
      <Divider />
      {formStep === 0 ? (
        <Form
          autoComplete='off'
          onFinish={onFinish}
          layout='vertical'
          requiredMark={"optional"}
          className='mb-4'>
          <Form.Item<FormProps>
            label='Your Full Name'
            name='customerName'
            rules={[{ required: true, message: "Name is required" }]}>
            <Input size='large' />
          </Form.Item>

          <Form.Item<FormProps>
            label='Country'
            name='countryCode'
            rules={[{ required: true, message: "Select your country" }]}>
            <Select
              showSearch
              optionFilterProp='label'
              size='large'
              options={countries}
            />
          </Form.Item>

          <Button
            type='primary'
            htmlType='submit'
            loading={isSubmitLoading}
            size='large'
            className='w-full'>
            Submit
          </Button>
        </Form>
      ) : (
        <Result
          icon={<SmileOutlined />}
          title='Great, you have Completed your KYC process!'
          extra={
            <Button type='primary' onClick={handleOk}>
              Done
            </Button>
          }
        />
      )}
    </Modal>
  );
}
