import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { TrashSimple } from "@phosphor-icons/react";
import { debounce } from "lodash";
import { db } from "@/database";
import { StyledLitanyRow } from "./StyledComponents";
import { LitanyBlock } from "@schema";

interface _props {
  row: LitanyBlock;
}

export default function LitanyRow({ row }: _props) {
  const handleChange = debounce(
    (litanyBlockId?: string, data?: Partial<LitanyBlock>) => {
      if (!litanyBlockId) return;
      db.transact([db.tx["litanyBlocks"][litanyBlockId].update({ ...data })]);
    },
    1000
  );

  const { id: litanyBlockId, call, response, superscript, inline } = row;

  const updateRowCall = (call: string) => handleChange(litanyBlockId, { call });

  const updateRowResponse = (response: string) =>
    handleChange(litanyBlockId, { response });

  const updateRowSuperscript = (superscript: string) =>
    handleChange(litanyBlockId, { superscript });

  const updateRowIsInline = (inline: boolean) =>
    handleChange(litanyBlockId, { inline });

  const removeRow = () => {
    if (!row) return;
    db.transact([db.tx["litanyBlocks"][litanyBlockId ?? ""].delete()]);
  };

  return (
    <StyledLitanyRow key={row.id}>
      <Textarea
        onChange={(e) => updateRowCall(e.target.value)}
        defaultValue={call}
      />

      <Textarea
        onChange={(e) => updateRowResponse(e.target.value)}
        defaultValue={response}
      />

      <Textarea
        onChange={(e) => updateRowSuperscript(e.target.value)}
        defaultValue={superscript}
      />

      <div>
        <Checkbox onCheckedChange={updateRowIsInline} defaultChecked={inline} />
      </div>

      <button onClick={removeRow}>
        <TrashSimple size={20} weight="duotone" color="var(--red-10)" />
      </button>
    </StyledLitanyRow>
  );
}
