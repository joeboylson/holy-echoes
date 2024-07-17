import { Box, Modal } from "@mui/material";
import { Check } from "@phosphor-icons/react";
import { useState } from "react";
import { Color } from "../types";
import { getLocalStorageColors, removeLocalStorageColor } from "../utils";
import { usePrayerBlockContext } from "../context/prayerBlocks";

interface _options {
  color: Color;
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

export default function useRemoveColorModal({ color }: _options) {
  const [open, setOpen] = useState<boolean>(false);
  const { setColors } = usePrayerBlockContext();

  const handleClose = () => setOpen(false);
  const handleOpenConfirm = () => setOpen(true);
  const handleConfirm = () => {
    setOpen(false);
    removeLocalStorageColor(color);
    setColors(getLocalStorageColors() ?? []);
  };

  const RemoveColorModal = () => {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="modal-body">
          <h2>Are you sure?</h2>
          <p>Are you sure you want to delete this color?</p>

          <button onClick={handleConfirm}>
            <Check size={16} weight="bold" />
          </button>
        </Box>
      </Modal>
    );
  };

  return {
    handleOpenConfirm,
    RemoveColorModal,
  };
}
