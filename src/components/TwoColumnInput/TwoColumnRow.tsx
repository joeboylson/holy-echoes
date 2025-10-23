import { Textarea } from "@/components/ui/textarea";
import { TrashSimple as TrashSimpleIcon } from "@phosphor-icons/react";
import { debounce } from "lodash";
import { db } from "@/database";
import { StyledTwoColumnRow } from "./StyledComponents";
import { LitanyBlock } from "@schema";
import { Button } from "@/components/ui/button";

interface _props {
  row: LitanyBlock;
}

export default function TwoColumnRow({ row }: _props) {
  const handleChange = debounce(
    (litanyBlockId?: string, data?: Partial<LitanyBlock>) => {
      if (!litanyBlockId) return;
      db.transact([db.tx.litanyBlocks[litanyBlockId].update({ ...data })]);
    },
    1000
  );

  const { id: litanyBlockId, call, response } = row;

  const updateRowCall = (call: string) => handleChange(litanyBlockId, { call });

  const updateRowResponse = (response: string) =>
    handleChange(litanyBlockId, { response });

  const removeRow = () => {
    if (!row) return;
    db.transact([db.tx.litanyBlocks[litanyBlockId ?? ""].delete()]);
  };

  return (
    <StyledTwoColumnRow key={row.id}>
      <Textarea
        onChange={(e) => updateRowCall(e.target.value)}
        defaultValue={call}
      />

      <Textarea
        onChange={(e) => updateRowResponse(e.target.value)}
        defaultValue={response}
      />

      <Button variant="destructive" size="icon" onClick={removeRow}>
        <TrashSimple size={20} weight="duotone" />
      </Button>
    </StyledTwoColumnRow>
  );
}
