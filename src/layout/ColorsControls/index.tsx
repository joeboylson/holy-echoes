import "./index.css";
import useAddColorModal from "../../hooks/useAddColorModal";
import useRemoveColorModal from "../../hooks/useRemoveColorModal";
import { Plus } from "@phosphor-icons/react";
import { Color } from "../../types";
import { usePrayerBlockContext } from "../../context/prayerBlocks";

export default function ColorsControls() {
  const { colors } = usePrayerBlockContext();

  const { handleOpenAddColorModal, AddColorModal } = useAddColorModal();

  return (
    <>
      <div id="layout-colorscontrols">
        <p>COLORS:</p>

        <button onClick={handleOpenAddColorModal}>
          <Plus size={20} weight="duotone" />
        </button>

        {colors?.map((color) => {
          return <ColorButton color={color} />;
        })}
      </div>
      <AddColorModal />
    </>
  );
}

interface __props {
  color: Color;
}

function ColorButton({ color }: __props) {
  const { handleOpenConfirm, RemoveColorModal } = useRemoveColorModal({
    color,
  });

  return (
    <>
      <RemoveColorModal />
      <button
        style={{ backgroundColor: color }}
        className="layout-colorscontrols-color"
        onClick={handleOpenConfirm}
      ></button>
    </>
  );
}
