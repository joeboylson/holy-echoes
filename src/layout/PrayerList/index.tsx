import { RowsPlusBottom } from "@phosphor-icons/react";
import styled from "styled-components";
import { db, Prayer, TableNames } from "../../database";
import { id } from "@instantdb/react";
import PrayerListItem from "./PrayerListItem";

const StyledPrayerList = styled.div`
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 12px;

  b {
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
  }

  a {
    padding: 8px 0;
  }
`;

const PrayerListItemsWrapper = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 4px;
`;

const { PRAYERS } = TableNames;

interface _props {
  allowAdmin?: boolean;
}

export default function PrayerList({ allowAdmin = false }: _props) {
  const { data } = db.useQuery({ [PRAYERS]: {} });

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];

  async function addNewPrayer() {
    const newPrayer: Prayer = { order: prayers.length, name: "New Prayer" };
    await db.transact([db.tx[PRAYERS][id()].update({ ...newPrayer })]);
  }

  return (
    <StyledPrayerList>
      <b>Prayer List</b>

      {allowAdmin && (
        <div>
          <button onClick={addNewPrayer}>
            <RowsPlusBottom size={20} color="#000000" weight="duotone" />
          </button>
        </div>
      )}

      <PrayerListItemsWrapper>
        {prayers.map((prayer) => (
          <PrayerListItem prayer={prayer} />
        ))}
      </PrayerListItemsWrapper>
    </StyledPrayerList>
  );
}
