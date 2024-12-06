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

import { debounce } from "lodash";
import { ArrowFatDown, ArrowFatUp, TrashSimple } from "@phosphor-icons/react";
import LitanyInput from "../../components/LitanyInput";

import {
  moveBlockDown,
  moveBlockUp,
  removeBlock,
  cascadeDeletePrayerBlock,
} from "../../utils";

import {
  BlockContent,
  BlockContentValues,
  BlockControls,
  BlockInputCurrentImageWrapper,
  BlockInputImage,
  MarkdownEditor,
  StyledBlockForm,
} from "./StyledComponents";

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
    <StyledBlockForm>
      <BlockContent>
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

        <BlockContentValues>
          {blockTypeName && (
            <>
              {blockTypeName === CENTERED_TITLE && (
                <>
                  <i>Large centered title</i>
                  <MarkdownEditor markdown={text} onChange={handleBodyChange} />
                </>
              )}

              {[IMAGE, SMALL_IMAGE].includes(blockTypeName) && (
                <>
                  {imageUrl ? (
                    <BlockInputCurrentImageWrapper>
                      <img src={imageUrl} alt="" />
                      <button onClick={handleClearImage}>Clear Image</button>
                    </BlockInputCurrentImageWrapper>
                  ) : (
                    <BlockInputImage
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                    />
                  )}
                </>
              )}

              {[BODY, BODY_CENTERED].includes(blockTypeName) && (
                <>
                  <i>
                    {blockTypeName === BODY_CENTERED ? "Centered" : "Standard"}
                    &nbsp;body text.
                  </i>
                  <i>Use italics, bold, and underline.</i>
                  <MarkdownEditor markdown={text} onChange={handleBodyChange} />
                </>
              )}

              {blockTypeName === INFO_TEXT && (
                <>
                  <i>Small & centered information text.</i>
                  <i>Use italics, bold, and underline.</i>
                  <MarkdownEditor markdown={text} onChange={handleBodyChange} />
                </>
              )}

              {blockTypeName === REFERENCE && (
                <>
                  <i>Small & centered reference text.</i>
                  <i>ALWAYS italics.</i>
                  <MarkdownEditor markdown={text} onChange={handleBodyChange} />
                </>
              )}

              {blockTypeName === QUOTE && (
                <>
                  <i>
                    Small left-justified quote with right-justified attribution.
                  </i>
                  <i>Automatic quotations and attribution dash</i>
                  <i>ALWAYS italics.</i>
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
        </BlockContentValues>
      </BlockContent>

      <BlockControls>
        <div>
          <button onClick={moveUp}>
            <ArrowFatUp size={20} weight="duotone" color="var(--blue-10)" />
          </button>
          <button onClick={moveDown}>
            <ArrowFatDown size={20} weight="duotone" color="var(--blue-10)" />
          </button>
        </div>
        <button onClick={deleteBlock}>
          <TrashSimple size={20} weight="duotone" color="var(--red-10)" />
        </button>
      </BlockControls>
    </StyledBlockForm>
  );
}
