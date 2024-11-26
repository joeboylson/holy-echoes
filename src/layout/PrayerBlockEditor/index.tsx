import "./index.css";
import "@mdxeditor/editor/style.css";
import BlockForm from "./blockForm";
import { RowsPlusBottom } from "@phosphor-icons/react";
import { PrayerBlock } from "../../database";

export default function PrayerBlockEditor() {
  const prayerBlocks = [] as PrayerBlock[];

  return (
    <>
      <div id="layout-prayerblockeditor">
        <div id="layout-prayerblockeditor-controls">
          <button onClick={() => {}}>
            <RowsPlusBottom size={20} color="#000000" weight="duotone" />
          </button>
        </div>

        {prayerBlocks.map((prayerBlock) => {
          return <BlockForm key={prayerBlock.id} prayerBlock={prayerBlock} />;
        })}
      </div>
    </>
  );
}
