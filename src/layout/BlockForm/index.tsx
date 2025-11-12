import LitanyInput from "../../components/LitanyInput";
import { useCallback, useMemo, useState } from "react";
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
import { TrashSimple as TrashSimpleIcon } from "@phosphor-icons/react";
import { removeBlock, cascadeDeletePrayerBlock } from "../../utils";
import { db } from "@/database";
import { BlockTypeNames, type BlockType, type PrayerBlock } from "@schema";
import { MDXEditor } from "@mdxeditor/editor";
import { Switch } from "@/components/ui/switch";
import TwoColumnInput from "@/components/TwoColumnInput";
import ImageBlockForm from "../ImageBlockForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
} = BlockTypeNames;

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
  const [blockTypeName, setBlockTypeName] = useState<
    BlockTypeNames | undefined
  >(prayerBlock.blockType?.name as BlockTypeNames);

  const text = useMemo(() => prayerBlock.text ?? "", [prayerBlock]);
  const reference = useMemo(() => prayerBlock.reference ?? "", [prayerBlock]);

  const handleTypeChange = useCallback(
    async (blockTypeId: string) => {
      const newBlockType = blockTypes.find((i) => i.id === blockTypeId);
      setBlockTypeName(newBlockType?.name as BlockTypeNames);

      const _id = prayerBlock.id;
      if (!_id || !blockTypeId) return;
      await db.transact([
        db.tx.prayerBlocks[_id].link({ blockType: blockTypeId }),
      ]);
    },
    [prayerBlock, blockTypes]
  );

  const handleBodyChange = debounce((text: string) => {
    const _id = prayerBlock.id;
    if (!_id) return;
    db.transact([db.tx.prayerBlocks[_id].update({ text })]);
  }, 1000);

  const handleSpaceAboveChange = (spaceAbove: boolean) => {
    const _id = prayerBlock.id;
    if (!_id) return;
    db.transact([db.tx.prayerBlocks[_id].update({ spaceAbove })]);
  };

  const handleReferenceChange = debounce((reference: string) => {
    const _id = prayerBlock.id;
    if (!_id) return;
    db.transact([db.tx.prayerBlocks[_id].update({ reference })]);
  }, 1000);

  const deleteBlock = () => {
    removeBlock(prayerBlock, allPrayerBlocks, "prayerBlocks");
    cascadeDeletePrayerBlock(prayerBlock);
  };

  const showSpacerAbove = useMemo(
    () => blockTypeName !== SPACER,
    [blockTypeName]
  );

  return (
    <Card className="py-0">
      <CardContent className="p-3 grid grid-cols-[1fr_24px] gap-1 items-start">
        <div className="grid grid-cols-1 gap-3 items-start [&_i]:text-xs">
          {showSpacerAbove && (
            <div className="grid grid-cols-[150px_1fr] gap-1 h-8 items-center">
              <p>
                {prayerBlock.spaceAbove
                  ? "Has Spacing Above:"
                  : "No Spacing Above:"}
              </p>
              <Switch
                checked={prayerBlock.spaceAbove}
                onCheckedChange={handleSpaceAboveChange}
              />
            </div>
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

          <div className="grid grid-cols-1 gap-1 items-start border-l border-black/10 pl-3">
            {blockTypeName && (
              <>
                {blockTypeName === CENTERED_TITLE && (
                  <>
                    <i>Large centered title</i>
                    <MDXEditor
                      markdown={text}
                      onChange={handleBodyChange}
                      className="border border-[#ddd] rounded-lg"
                    />
                  </>
                )}

                {[IMAGE, SMALL_IMAGE, ICON].includes(
                  blockTypeName as BlockTypeNames
                ) && <ImageBlockForm prayerBlock={prayerBlock} />}

                {[BODY, BODY_CENTERED].includes(
                  blockTypeName as BlockTypeNames
                ) && (
                  <>
                    <i>
                      {blockTypeName === BODY_CENTERED
                        ? "Centered"
                        : "Standard"}
                      &nbsp;body text.
                    </i>
                    <i>Use italics, bold, and underline.</i>
                    <MDXEditor
                      markdown={text}
                      onChange={handleBodyChange}
                      className="border border-[#ddd] rounded-lg"
                    />
                  </>
                )}

                {blockTypeName === INFO_TEXT && (
                  <>
                    <i>Small & centered information text.</i>
                    <i>Use italics, bold, and underline.</i>
                    <MDXEditor
                      markdown={text}
                      onChange={handleBodyChange}
                      className="border border-[#ddd] rounded-lg"
                    />
                  </>
                )}

                {blockTypeName === REFERENCE && (
                  <>
                    <i>Small & centered reference text.</i>
                    <i>ALWAYS italics.</i>
                    <MDXEditor
                      markdown={text}
                      onChange={handleBodyChange}
                      className="border border-[#ddd] rounded-lg"
                    />
                  </>
                )}

                {blockTypeName === QUOTE && (
                  <>
                    <i>
                      Small left-justified quote with right-justified
                      attribution.
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
          </div>
        </div>

        <div className="flex flex-col justify-between items-center min-h-[100px] [&_button]:bg-transparent [&_button]:border-0 [&_button]:outline-0">
          <Button variant="destructive" size="icon" onClick={deleteBlock}>
            <TrashSimpleIcon size={20} weight="duotone" color="red" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
