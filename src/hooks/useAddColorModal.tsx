import { Box, Modal, TextField } from "@mui/material";
import { Check } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { addLocalStorageColor, getLocalStorageColors } from "../utils";
import { usePrayerBlockContext } from "../context/prayerBlocks";

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

export default function useAddColorModal() {
  const colorRef = useRef<string>();
  const [open, setOpen] = useState<boolean>(false);
  const { setColors } = usePrayerBlockContext();

  const handleClose = () => setOpen(false);
  const handleOpenAddColorModal = () => setOpen(true);
  const handleConfirm = () => {
    setOpen(false);
    if (colorRef.current) addLocalStorageColor(colorRef.current);
    setColors(getLocalStorageColors() ?? []);
  };

  const AddColorModal = () => {
    const [color, _setColor] = useState<string>();

    const setColor = (color: string) => {
      colorRef.current = color;
      _setColor(color);
    };

    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="modal-body">
          <h2>Add Color</h2>

          <TextField
            variant="outlined"
            size="small"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <div className="color-picker-wrapper">
            <HexColorPicker onChange={setColor} color={color} />
            <div
              style={{ backgroundColor: color }}
              className="color-preview"
            ></div>
          </div>
          <button onClick={handleConfirm}>
            <Check size={16} weight="bold" />
          </button>
        </Box>
      </Modal>
    );
  };

  return {
    handleOpenAddColorModal,
    AddColorModal,
  };
}
