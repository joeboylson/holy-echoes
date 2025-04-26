import LitanyInput from "../../components/LitanyInput";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "lodash";
import { TrashSimple } from "@phosphor-icons/react";
import { removeBlock, cascadeDeletePrayerBlock } from "../../utils";
import {
  BlockType,
  BlockTypes,
  db,
  PrayerBlock,
  TableNames,
} from "../../database";
import {
  BlockContent,
  BlockContentValues,
  BlockControls,
  BlockInputCurrentImageWrapper,
  BlockInputImage,
  MarkdownEditor,
  SpaceAboveWrapper,
  StyledBlockForm,
} from "./StyledComponents";
import { Switch } from "@/components/ui/switch";
import TwoColumnInput from "@/components/TwoColumnInput";

const { PRAYERBLOCKS } = TableNames;

const {
  BODY,
  BODY_CENTERED,
  CENTERED_TITLE,
  IMAGE,
  INFO_TEXT,
  LITANY,
  TWO_COLUMN,
  QUOTE,
  REFERENCE,
  SMALL_IMAGE,
  SPACER,
  ICON,
} = BlockTypes;

interface _props {
  prayerBlock: PrayerBlock;
  allPrayerBlocks: PrayerBlock[];
  blockTypes: BlockType[];
}

export default function BlockForm({
  prayerBlock,
  allPrayerBlocks,
  blockTypes,
}: _props) {
  const [blockTypeName, setBlockTypeName] = useState(
    prayerBlock.blockType?.name
  );

  const imageUrl = useMemo(() => prayerBlock.imageUrl, [prayerBlock]);
  const text = useMemo(() => prayerBlock.text ?? "", [prayerBlock]);
  const reference = useMemo(() => prayerBlock.reference ?? "", [prayerBlock]);

  const handleTypeChange = useCallback(
    async (blockTypeId: string) => {
      const newBlockType = blockTypes.find((i) => i.id === blockTypeId);
      setBlockTypeName(newBlockType?.name);

      const _id = prayerBlock.id;
      if (!_id || !blockTypeId) return;
      await db.transact([
        db.tx[PRAYERBLOCKS][_id].link({ blockType: blockTypeId }),
      ]);
    },
    [prayerBlock]
  );

  const handleBodyChange = debounce((text: string) => {
    const _id = prayerBlock.id;
    if (!_id) return;
    db.transact([db.tx[PRAYERBLOCKS][_id].update({ text })]);
  }, 250);

  const handleSpaceAboveChange = (spaceAbove: boolean) => {
    const _id = prayerBlock.id;
    if (!_id) return;
    db.transact([db.tx[PRAYERBLOCKS][_id].update({ spaceAbove })]);
  };

  const handleReferenceChange = debounce((reference: string) => {
    const _id = prayerBlock.id;
    if (!_id) return;
    db.transact([db.tx[PRAYERBLOCKS][_id].update({ reference })]);
  }, 250);

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

  const showSpacerAbove = useMemo(
    () => blockTypeName !== SPACER,
    [blockTypeName]
  );

  return (
    <StyledBlockForm>
      <BlockContent>
        {showSpacerAbove && (
          <SpaceAboveWrapper>
            <p>
              {prayerBlock.spaceAbove
                ? "Has Spacing Above:"
                : "No Spacing Above:"}
            </p>
            <Switch
              checked={prayerBlock.spaceAbove}
              onCheckedChange={handleSpaceAboveChange}
            />
          </SpaceAboveWrapper>
        )}

        <Select
          defaultValue={prayerBlock.blockType?.id ?? ""}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose Block Type" />
          </SelectTrigger>
          <SelectContent>
            {blockTypes.map((blockType) => (
              <SelectItem key={blockType.id} value={blockType.id ?? ""}>
                {blockType.name}
              </SelectItem>
            ))}
          </SelectContent>
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

              {[IMAGE, SMALL_IMAGE, ICON].includes(blockTypeName) && (
                <>
                  {imageUrl ? (
                    <BlockInputCurrentImageWrapper blockType={blockTypeName}>
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
                  <Textarea
                    defaultValue={text}
                    onChange={(e) => handleBodyChange(`${e.target.value}`)}
                  />
                  <Input
                    defaultValue={reference}
                    onChange={(e) => handleReferenceChange(e.target.value)}
                  />
                </>
              )}

              {blockTypeName === LITANY && (
                <>
                  <i>Input a litany</i>
                  <LitanyInput prayerBlockId={prayerBlock.id} />
                </>
              )}

              {blockTypeName === TWO_COLUMN && (
                <>
                  <i>Input a two-column prayer</i>
                  <TwoColumnInput prayerBlockId={prayerBlock.id} />
                </>
              )}

              {blockTypeName === SPACER && (
                <>
                  <i>Add a custom spacer between other blocks</i>
                  <Input
                    defaultValue={text === "" ? 24 : text}
                    onChange={(e) => handleBodyChange(e.target.value)}
                    min={0}
                    max={100}
                    type="number"
                  />
                </>
              )}
            </>
          )}
        </BlockContentValues>
      </BlockContent>

      <BlockControls>
        <button onClick={deleteBlock}>
          <TrashSimple size={20} weight="duotone" color="var(--red-10)" />
        </button>
      </BlockControls>
    </StyledBlockForm>
  );
}
