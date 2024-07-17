import "./index.css";
import "@mdxeditor/editor/style.css";
import { usePrayerBlockContext } from "../../context/prayerBlocks";
import BlockForm from "./blockForm";
import {
  BracketsCurly,
  RowsPlusBottom,
  StackMinus,
} from "@phosphor-icons/react";
import useConfirmModal from "../../hooks/useConfirmModal";
import { useState } from "react";
import PrayerBlockJSONViewer from "../PrayerBlockJSONViewer";
import ColorsControls from "../ColorsControls";

export default function PrayerBlockEditor() {
  const [JSONViewerIsVisible, setJSONViewerIsVisible] = useState(false);
  const openJSONViewer = () => setJSONViewerIsVisible(true);

  const { blocks, addBlock, clearBlocks } = usePrayerBlockContext();

  const {
    handleOpenConfirm: confirmClearBlocks,
    ConfirmModal: ConfirmClearBlocksModal,
  } = useConfirmModal({
    onConfirm: clearBlocks,
    title: "Are you sure you want to remove all content?",
    content: <i>This action cannot be reversed!</i>,
  });

  return (
    <>
      {/**
       *
       */}
      <PrayerBlockJSONViewer
        visible={JSONViewerIsVisible}
        setVisible={setJSONViewerIsVisible}
      />

      {/**
       *
       */}
      <div id="layout-prayerblockeditor">
        {/**
         *
         */}
        <div id="layout-prayerblockeditor-controls">
          <button onClick={addBlock}>
            <RowsPlusBottom size={20} color="#000000" weight="duotone" />
          </button>
          <button onClick={confirmClearBlocks}>
            <StackMinus size={20} color="#000000" weight="duotone" />
          </button>
          <button onClick={openJSONViewer}>
            <BracketsCurly size={20} weight="duotone" />
          </button>
          <ColorsControls />
        </div>

        {/**
         *
         */}
        {blocks &&
          blocks.map((block) => {
            return <BlockForm key={block.id} block={block} />;
          })}
      </div>
      <ConfirmClearBlocksModal />
    </>
  );
}
