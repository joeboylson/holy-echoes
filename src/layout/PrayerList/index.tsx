import styled from "styled-components";
import { db, Prayer, TableNames } from "../../database";
import PrayerListItem from "./PrayerListItem";

const StyledPrayerList = styled.div`
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

  return (
    <StyledPrayerList>
      <PrayerListItemsWrapper>
        {prayers.map((prayer) => (
          <PrayerListItem prayer={prayer} key={prayer.id} />
        ))}
      </PrayerListItemsWrapper>
    </StyledPrayerList>
  );
}
