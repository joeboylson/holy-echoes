import { useCallback } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import {
  BlockType,
  BlockTypes,
  db,
  PrayerBlock,
  TableNames,
} from "../../database";
import { MDXEditor } from "@mdxeditor/editor";
import { debounce, indexOf } from "lodash";
import { ArrowFatDown, ArrowFatUp } from "@phosphor-icons/react";

const { BLOCKTYPES, PRAYERBLOCKS } = TableNames;

interface _props {
  prayerBlock: PrayerBlock;
  allPrayerBlocks: PrayerBlock[];
}

export default function BlockForm({ prayerBlock, allPrayerBlocks }: _props) {
  const { data } = db.useQuery({ [BLOCKTYPES]: {} });
  const blockTypes = (data?.[BLOCKTYPES] ?? []) as BlockType[];

  const handleTypeChange = useCallback(
    (event: SelectChangeEvent) => {
      const _id = prayerBlock.id;
      if (!_id) return;

      const blockTypeId = event.target.value;
      if (!blockTypeId) return;

      db.transact([db.tx[PRAYERBLOCKS][_id].link({ blockType: blockTypeId })]);
    },
    [prayerBlock]
  );

  const handleBodyChange = debounce((text: string) => {
    const _id = prayerBlock.id;
    if (!_id) return;

    db.transact([db.tx[PRAYERBLOCKS][_id].update({ text })]);
  }, 1000);

  const moveBlockUp = useCallback(() => {
    const _id = prayerBlock.id;
    if (!_id) return;

    const currentIndex = indexOf(allPrayerBlocks, prayerBlock);
    if (currentIndex === 0) return;

    const prayerBlockPrev = allPrayerBlocks[currentIndex - 1];
    const prevId = prayerBlockPrev.id;
    if (!prevId) return;

    const currentOrder = prayerBlock.order;

    db.transact([
      db.tx[PRAYERBLOCKS][_id].update({ order: prayerBlockPrev.order }),
      db.tx[PRAYERBLOCKS][prevId].update({ order: currentOrder }),
    ]);
  }, [allPrayerBlocks, prayerBlock]);

  const moveBlockDown = useCallback(() => {
    const _id = prayerBlock.id;
    if (!_id) return;

    const currentIndex = indexOf(allPrayerBlocks, prayerBlock);
    if (currentIndex === allPrayerBlocks.length - 1) return;

    const prayerBlockNext = allPrayerBlocks[currentIndex + 1];
    const nextId = prayerBlockNext.id;
    if (!nextId) return;

    const currentOrder = prayerBlock.order;

    db.transact([
      db.tx[PRAYERBLOCKS][_id].update({ order: prayerBlockNext.order }),
      db.tx[PRAYERBLOCKS][nextId].update({ order: currentOrder }),
    ]);
  }, [allPrayerBlocks, prayerBlock]);

  // const handleQuoteReferenceExtra = useCallback(
  //   (quoteReference: string) => {
  //     const extra: BlockExtra = { quoteReference };
  //     updateBlock({ ...block, extra });
  //   },
  //   [block, updateBlock]
  // );

  // const handleFileInputChange = useCallback(
  //   (event: ChangeEvent<HTMLInputElement>) => {
  //     if (!event.target.files) return;
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = (event) => {
  //       if (!event.target) return;

  //       const imageUrl = event.target.result?.toString();
  //       if (!imageUrl)
  //         return alert("Something went wrong uploading that image");

  //       const extra: BlockExtra = { imageUrl };
  //       updateBlock({ ...block, extra });
  //     };
  //   },
  //   [block, updateBlock]
  // );

  // const handleLitanyChange = useCallback(
  //   (litanyData: LitanyRow[]) => {
  //     const extra: BlockExtra = { litanyData };
  //     updateBlock({ ...block, extra });
  //   },
  //   [block, updateBlock]
  // );

  // const handleRemoveBlock = () => removeBlock(block);
  // const handleMoveBlockUp = () => moveBlockUp(block);
  // const handleMoveBlockDown = () => moveBlockDown(block);

  return (
    <div className="layout-blockform">
      <div className="layout-blockform-content">
        {/**
         * TYPE
         */}
        <Select
          value={prayerBlock.blockType?.id ?? ""}
          onChange={handleTypeChange}
          size="small"
        >
          {blockTypes.map((blockType) => (
            <MenuItem value={blockType.id}>{blockType.name}</MenuItem>
          ))}
        </Select>

        {prayerBlock.blockType?.name === BlockTypes.CENTERED_TITLE && (
          <>
            <i>The title will larger and in blue.</i>
            <div className="editor-wrapper">
              <MDXEditor
                markdown={prayerBlock.text ?? ""}
                onChange={handleBodyChange}
              />
            </div>
          </>
        )}

        {/* <>
            <i>Upload a photo!</i>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
            ></input>
          </> */}

        {/* <>
            <i>
              This is standard body text. Italics, bold, and underline are fully
              available.
            </i>
            <div className="editor-wrapper">
              <MDXEditor markdown={block.text} onChange={handleBodyChange} />
            </div>
          </> */}

        {/* <>
            <i>
              This is standard body text, EXCEPT that it will center the text.
              Italics, bold, and underline are fully available.
            </i>
            <div className="editor-wrapper">
              <MDXEditor markdown={block.text} onChange={handleBodyChange} />
            </div>
          </> */}

        {/* <>
            <i>
              This block can be used to add prayer information before or after
              the prayer. Feel free to use bold, italics, and underline!
            </i>
            <div className="editor-wrapper">
              <MDXEditor markdown={block.text} onChange={handleBodyChange} />
            </div>
          </> */}

        {/* <>
            <i>
              This block is meant to be used to add reference text for the
              Raccolta, or another text.
            </i>
            <i>This text will always render italics and never bold.</i>
            <div className="editor-wrapper">
              <MDXEditor markdown={block.text} onChange={handleBodyChange} />
            </div>
          </> */}

        {/* <>
            <i>
              Add the quote in the first box, and then the reference in the
              second box. This text will always render italics.
            </i>
            <i>
              This first box will automatically add the quotation marks AND
              always render italics.
            </i>
            <TextField
              multiline
              size="small"
              onChange={(e) => handleBodyChange(`"${e.target.value}"`)}
              InputProps={{
                endAdornment: <InputAdornment position="end">"</InputAdornment>,
                startAdornment: (
                  <InputAdornment position="start">"</InputAdornment>
                ),
              }}
            />
            <i>
              No need to add the prefix dash "—". This will be done
              automatically! Italics, Bold, and underline are not available in
              this block.
            </i>
            <TextField
              size="small"
              onChange={(e) => handleQuoteReferenceExtra(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">—</InputAdornment>
                ),
              }}
            />
          </> */}

        {/* <>
            <i>Input a litany</i>
            <LitanyInput
              onChange={handleLitanyChange}
              data={block.extra?.litanyData}
            />
          </> */}
      </div>

      <div className="layout-blockform-controls">
        <button onClick={moveBlockUp}>
          <ArrowFatUp size={20} weight="duotone" />
        </button>
        <button onClick={moveBlockDown}>
          <ArrowFatDown size={20} weight="duotone" />
        </button>
        {/* <button onClick={handleRemoveBlock}>
          <TrashSimple size={20} color="#e20303" weight="duotone" />
        </button> */}
      </div>
    </div>
  );
}
