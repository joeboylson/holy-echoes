import "./index.css";
import { JSONTree } from "react-json-tree";
import { usePrayerBlockContext } from "../../context/prayerBlocks";
import { X } from "@phosphor-icons/react";

interface _props {
  visible: boolean;
  setVisible: (_visible: boolean) => void;
}

export default function PrayerBlockJSONViewer({ visible, setVisible }: _props) {
  const { blocks } = usePrayerBlockContext();
  const closeJSONViewer = () => setVisible(false);

  return (
    <>
      <div
        id="layout-prayerblockjsonviewer"
        className={visible ? "visible" : ""}
      >
        <button onClick={closeJSONViewer}>
          <X size={20} weight="duotone" />
        </button>
        <JSONTree
          data={blocks}
          hideRoot
          shouldExpandNodeInitially={() => true}
        />
      </div>
      <div
        id="layout-prayerblockjsonviewer-overlay"
        className={visible ? "visible" : ""}
      ></div>
    </>
  );
}
