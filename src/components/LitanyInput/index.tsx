import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowFatDown, ArrowFatUp, TrashSimple } from "@phosphor-icons/react";
import { debounce, first, isEqual, last, orderBy } from "lodash";
import { db, LitanyBlock, PrayerBlock, TableNames } from "../../database";
import { id } from "@instantdb/react";
import { moveBlockDown, moveBlockUp } from "../../utils";
import { LitanyRow, LitanyRowWrapper, RowHeader } from "./StyledComponents";
import AddNewButton from "../AddNewButton";

const { PRAYERBLOCKS, LITANYBLOCKS } = TableNames;

interface _props {
  prayerBlockId?: string;
}

export default function LitanyInput({ prayerBlockId }: _props) {
  const { data } = db.useQuery(
    prayerBlockId
      ? {
          [PRAYERBLOCKS]: {
            [LITANYBLOCKS]: {},
            $: { where: { id: prayerBlockId } },
          },
        }
      : null
  );

  const prayerBlocks = (data?.[PRAYERBLOCKS] ?? []) as PrayerBlock[];
  const litanyBlocks = first(prayerBlocks)?.litanyBlocks as LitanyBlock[];
  const orderedLitanyBlocks = orderBy(litanyBlocks, "order");
  const numberOfItems = orderedLitanyBlocks?.length ?? 0;

  const handleAddNewRow = useCallback(() => {
    if (!prayerBlockId) return;

    const _id = id();
    const order = numberOfItems;
    db.transact([
      db.tx[LITANYBLOCKS][_id]
        .update({ order })
        .link({ prayerBlock: prayerBlockId }),
    ]);
  }, [prayerBlockId, numberOfItems]);

  const handleChange = debounce(
    (litanyBlockId?: string, data?: Partial<LitanyBlock>) => {
      if (!litanyBlockId) return;
      db.transact([db.tx[LITANYBLOCKS][litanyBlockId].update({ ...data })]);
    },
    500
  );

  return (
    <LitanyRowWrapper>
      <LitanyRow>
        <RowHeader>Call</RowHeader>
        <RowHeader>Response</RowHeader>
        <RowHeader>Sup.</RowHeader>
        <RowHeader>Inline?</RowHeader>
      </LitanyRow>

      {orderedLitanyBlocks?.map((i) => {
        const litanyBlockId = i.id;

        const updateRowCall = (call: string) =>
          handleChange(litanyBlockId, { call });

        const updateRowResponse = (response: string) =>
          handleChange(litanyBlockId, { response });

        const updateRowSuperscript = (superscript: string) =>
          handleChange(litanyBlockId, { superscript });

        const updateRowIsInline = (inline: boolean) =>
          handleChange(litanyBlockId, { inline });

        const moveUp = () => moveBlockUp(i, orderedLitanyBlocks, LITANYBLOCKS);
        const moveDown = () =>
          moveBlockDown(i, orderedLitanyBlocks, LITANYBLOCKS);

        const removeRow = () => alert("TODO");

        return (
          <LitanyRow key={i.id}>
            {/* Call */}
            <Textarea
              onChange={(e) => updateRowCall(e.target.value)}
              defaultValue={i.call}
            />

            {/* Response */}
            <Textarea
              onChange={(e) => updateRowResponse(e.target.value)}
              defaultValue={i.response}
            />

            {/* Superscript */}
            <Textarea
              onChange={(e) => updateRowSuperscript(e.target.value)}
              defaultValue={i.superscript}
            />

            <div>
              <Checkbox
                onCheckedChange={updateRowIsInline}
                defaultChecked={i.inline}
              />
            </div>

            {isEqual(i, first(orderedLitanyBlocks)) ? (
              <span />
            ) : (
              <button onClick={moveUp}>
                <ArrowFatUp size={20} weight="duotone" color="var(--blue-10)" />
              </button>
            )}

            {isEqual(i, last(orderedLitanyBlocks)) ? (
              <span />
            ) : (
              <button onClick={moveDown}>
                <ArrowFatDown
                  size={20}
                  weight="duotone"
                  color="var(--blue-10)"
                />
              </button>
            )}

            <button onClick={removeRow}>
              <TrashSimple size={20} weight="duotone" color="var(--red-10)" />
            </button>
          </LitanyRow>
        );
      })}

      <AddNewButton onClick={handleAddNewRow} itemName="Row" />
    </LitanyRowWrapper>
  );
}
