import { Modal } from "antd";

interface DeleteKccModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  confirmLoading: boolean;
}

export default function DeleteKccModal({
  open,
  confirmLoading,
  onCancel,
  onOk,
}: DeleteKccModalProps) {
  return (
    <Modal
      open={open}
      confirmLoading={confirmLoading}
      destroyOnClose
      onCancel={onCancel}
      onOk={onOk}
      className='max-w-sm'>
      <p>Are you sure you want to delete your verifiable credentials?</p>
      <p className='font-semibold my-4'>
        <span className='text-red-500'>NB:</span> Once you delete them, you will
        not be able to make transactions with PFIs that issued the
        Credential(s). You will have to reapply for the credentials.
      </p>
    </Modal>
  );
}
