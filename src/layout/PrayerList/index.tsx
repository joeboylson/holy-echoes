import { RowsPlusBottom } from "@phosphor-icons/react";
import styled from "styled-components";
import { db, Prayer, TableNames } from "../../database";
import { id } from "@instantdb/react";

const StyledPrayerList = styled.div`
  border-right: 1px solid #ddd;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 12px;

  b {
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
  }
`;

const PrayerListItemsWrapper = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  justify-items: start;
  gap: 12px;
`;

const { PRAYERS } = TableNames;

export default function PrayerList() {
  const { data } = db.useQuery({ [PRAYERS]: {} });

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];

  async function addNewPrayer() {
    const newPrayer: Prayer = { order: prayers.length, name: "New Prayer" };
    await db.transact([db.tx[PRAYERS][id()].update({ ...newPrayer })]);
  }

  return (
    <StyledPrayerList>
      <b>Prayer List</b>

      <div>
        <button onClick={addNewPrayer}>
          <RowsPlusBottom size={20} color="#000000" weight="duotone" />
        </button>
      </div>

      <PrayerListItemsWrapper>
        {prayers.map((prayer) => {
          return <a href="">{prayer.name}</a>;
        })}
      </PrayerListItemsWrapper>
    </StyledPrayerList>
  );
}
