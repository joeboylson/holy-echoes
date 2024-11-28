import { ChangeEvent, useCallback } from "react";

import {
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

import {
  BlockType,
  BlockTypes,
  db,
  PrayerBlock,
  TableNames,
} from "../../database";

import { MDXEditor } from "@mdxeditor/editor";
import { debounce } from "lodash";
import { ArrowFatDown, ArrowFatUp, TrashSimple } from "@phosphor-icons/react";
import LitanyInput from "../../components/LitanyInput";

import {
  moveBlockDown,
  moveBlockUp,
  removeBlock,
  cascadeDeletePrayerBlock,
} from "../../utils";

const { BLOCKTYPES, PRAYERBLOCKS } = TableNames;

const {
  BODY,
  BODY_CENTERED,
  CENTERED_TITLE,
  IMAGE,
  INFO_TEXT,
  LITANY,
  QUOTE,
  REFERENCE,
  SMALL_IMAGE,
} = BlockTypes;

interface _props {
  prayerBlock: PrayerBlock;
  allPrayerBlocks: PrayerBlock[];
}

export default function BlockForm({ prayerBlock, allPrayerBlocks }: _props) {
  const { data } = db.useQuery({ [BLOCKTYPES]: {} });
  const blockTypes = (data?.[BLOCKTYPES] ?? []) as BlockType[];
  const blockTypeName = prayerBlock.blockType?.name;
  const imageUrl = prayerBlock.imageUrl;
  const text = prayerBlock.text ?? "";
  const reference = prayerBlock.reference ?? "";

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

  const handleReferenceChange = debounce((reference: string) => {
    const _id = prayerBlock.id;
    if (!_id) return;

    db.transact([db.tx[PRAYERBLOCKS][_id].update({ reference })]);
  }, 1000);

  const moveUp = () => moveBlockUp(prayerBlock, allPrayerBlocks, PRAYERBLOCKS);

  const moveDown = () =>
    moveBlockDown(prayerBlock, allPrayerBlocks, PRAYERBLOCKS);

  const handleUploadImage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const _id = prayerBlock.id;
      if (!_id) return;

      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        if (!event.target) return;

        const imageUrl = event.target.result?.toString();
        if (!imageUrl)
          return alert("Something went wrong uploading that image");

        db.transact([db.tx[PRAYERBLOCKS][_id].update({ imageUrl })]);
      };
    },
    [prayerBlock]
  );

  const handleClearImage = useCallback(() => {
    const _id = prayerBlock.id;
    if (!_id) return;
    db.transact([db.tx[PRAYERBLOCKS][_id].update({ imageUrl: null })]);
  }, [prayerBlock]);

  const deleteBlock = () => {
    removeBlock(prayerBlock, allPrayerBlocks, PRAYERBLOCKS);
    cascadeDeletePrayerBlock(prayerBlock);
  };

  return (
    <div className="layout-blockform">
      <div className="layout-blockform-content">
        <Select
          value={prayerBlock.blockType?.id ?? ""}
          onChange={handleTypeChange}
          size="small"
        >
          {blockTypes.map((blockType) => (
            <MenuItem key={blockType.id} value={blockType.id}>
              {blockType.name}
            </MenuItem>
          ))}
        </Select>

        {blockTypeName && (
          <>
            {blockTypeName === CENTERED_TITLE && (
              <>
                <i>The title will larger and in blue.</i>
                <div className="editor-wrapper">
                  <MDXEditor markdown={text} onChange={handleBodyChange} />
                </div>
              </>
            )}

            {[IMAGE, SMALL_IMAGE].includes(blockTypeName) && (
              <>
                <i>Upload a photo!</i>
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="" />
                    <button onClick={handleClearImage}>Clear Image</button>
                  </>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                  ></input>
                )}
              </>
            )}

            {[BODY, BODY_CENTERED].includes(blockTypeName) && (
              <>
                {blockTypeName === BODY && (
                  <i>
                    This is standard body text. Italics, bold, and underline are
                    fully available.
                  </i>
                )}

                {blockTypeName === BODY_CENTERED && (
                  <i>
                    This is standard body text, EXCEPT that it will center the
                    text. Italics, bold, and underline are fully available.
                  </i>
                )}
                <div className="editor-wrapper">
                  <MDXEditor markdown={text} onChange={handleBodyChange} />
                </div>
              </>
            )}

            {blockTypeName === INFO_TEXT && (
              <>
                <i>
                  This block can be used to add prayer information before or
                  after the prayer. Feel free to use bold, italics, and
                  underline!
                </i>
                <div className="editor-wrapper">
                  <MDXEditor markdown={text} onChange={handleBodyChange} />
                </div>
              </>
            )}

            {blockTypeName === REFERENCE && (
              <>
                <i>
                  This block is meant to be used to add reference text for the
                  Raccolta, or another text.
                </i>
                <i>This text will always render italics and never bold.</i>
                <div className="editor-wrapper">
                  <MDXEditor markdown={text} onChange={handleBodyChange} />
                </div>
              </>
            )}

            {blockTypeName === QUOTE && (
              <>
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
                  defaultValue={text}
                  onChange={(e) => handleBodyChange(`${e.target.value}`)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">"</InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">"</InputAdornment>
                    ),
                  }}
                />
                <i>
                  No need to add the prefix dash "—". This will be done
                  automatically! Italics, Bold, and underline are not available
                  in this block.
                </i>
                <TextField
                  size="small"
                  defaultValue={reference}
                  onChange={(e) => handleReferenceChange(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">—</InputAdornment>
                    ),
                  }}
                />
              </>
            )}
            {blockTypeName === LITANY && (
              <>
                <i>Input a litany</i>
                <LitanyInput prayerBlockId={prayerBlock.id} />
              </>
            )}
          </>
        )}
      </div>

      <div className="layout-blockform-controls">
        <button onClick={moveUp}>
          <ArrowFatUp size={20} weight="duotone" />
        </button>
        <button onClick={moveDown}>
          <ArrowFatDown size={20} weight="duotone" />
        </button>
        <button onClick={deleteBlock}>
          <TrashSimple size={20} color="#e20303" weight="duotone" />
        </button>
      </div>
    </div>
  );
}
