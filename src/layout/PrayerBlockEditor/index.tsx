import "./index.css";
import "@mdxeditor/editor/style.css";
import { usePrayerBlockContext } from "../../context/prayerBlocks";
import BlockForm from "./blockForm";
import { RowsPlusBottom } from "@phosphor-icons/react";

export default function PrayerBlockEditor() {
  const { blocks, addBlock } = usePrayerBlockContext();

  return (
    <>
      <div id="layout-prayerblockeditor">
        <div id="layout-prayerblockeditor-controls">
          <button onClick={addBlock}>
            <RowsPlusBottom size={20} color="#000000" weight="duotone" />
          </button>
        </div>

        {blocks &&
          blocks.map((block) => {
            return <BlockForm key={block.id} block={block} />;
          })}
      </div>
    </>
  );
}
