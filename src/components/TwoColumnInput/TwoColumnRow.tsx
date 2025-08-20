import { Textarea } from "@/components/ui/textarea";
import { TrashSimple } from "@phosphor-icons/react";
import { debounce } from "lodash";
import { db, TableNames } from "../../database";
import type { LitanyBlock } from "../../database/types";
import { StyledTwoColumnRow } from "./StyledComponents";

const { LITANYBLOCKS } = TableNames;

interface _props {
  row: LitanyBlock;
}

export default function TwoColumnRow({ row }: _props) {
  const handleChange = debounce(
    (litanyBlockId?: string, data?: Partial<LitanyBlock>) => {
      if (!litanyBlockId) return;
      db.transact([db.tx[LITANYBLOCKS][litanyBlockId].update({ ...data })]);
    },
    1000
  );

  const { id: litanyBlockId, call, response } = row;

  const updateRowCall = (call: string) => handleChange(litanyBlockId, { call });

  const updateRowResponse = (response: string) =>
    handleChange(litanyBlockId, { response });

  const removeRow = () => {
    if (!row) return;
    db.transact([db.tx[LITANYBLOCKS][litanyBlockId ?? ""].delete()]);
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

      <button onClick={removeRow}>
        <TrashSimple size={20} weight="duotone" color="var(--red-10)" />
      </button>
    </StyledTwoColumnRow>
  );
}
