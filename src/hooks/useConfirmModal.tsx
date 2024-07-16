import { Box, Modal } from "@mui/material";
import { Check } from "@phosphor-icons/react";
import { ReactNode, useState } from "react";

interface _options {
  onConfirm: () => void;
  title: string;
  content: ReactNode;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function useConfirmModal({
  onConfirm,
  title,
  content,
}: _options) {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => setOpen(false);
  const handleOpenConfirm = () => setOpen(true);
  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  const ConfirmModal = () => {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="modal-body">
          <h2>{title}</h2>
          {content}

          <button onClick={handleConfirm}>
            <Check size={16} weight="bold" />
          </button>
        </Box>
      </Modal>
    );
  };

  return {
    handleOpenConfirm,
    ConfirmModal,
  };
}
