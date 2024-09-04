"use client";
import { useState } from "react";
import { Modal } from "antd";

type CreateBTCAccoutProps = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export default function CreateBTCModal({
  open,
  openModal,
}: CreateBTCAccoutProps) {
  const [loading, setLoading] = useState(false);
  return (
    <Modal open={open} onCancel={openModal}>
      <p>Thank you</p>
      This is going to be the modal of the app
    </Modal>
  );
}
