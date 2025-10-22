import { Dialog } from "@/components/ui/dialog";
import { Check } from "@phosphor-icons/react";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";

interface _options {
  onConfirm: () => void;
  title: string;
  content: ReactNode;
}

export default function useConfirmModal({
  onConfirm,
  title,
  content,
}: _options) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenConfirm = () => setOpen(true);
  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  const ConfirmModal = () => {
    return (
      <Dialog open={open}>
        <h2>{title}</h2>
        {content}

        <Button variant="primary" onClick={handleConfirm}>
          <Check size={16} weight="bold" /> Confirm
        </Button>
      </Dialog>
    );
  };

  return {
    handleOpenConfirm,
    ConfirmModal,
  };
}
