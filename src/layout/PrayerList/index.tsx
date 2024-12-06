import styled from "styled-components";
import { db, Prayer, TableNames } from "../../database";
import PrayerListItem from "./PrayerListItem";
import { isEmpty } from "lodash";
import { useMemo } from "react";

const StyledPrayerList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 12px;
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
  filterUnpublished?: boolean;
  showFilters?: boolean;
}

export default function PrayerList({
  filterUnpublished = true,
  showFilters = false,
}: _props) {
  const filter = useMemo(() => {
    if (!filterUnpublished) return {};

    return {
      where: {
        published: true,
      },
    };
  }, [filterUnpublished]);

  const { data } = db.useQuery({
    [PRAYERS]: {
      $: filter,
    },
  });

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];

  return (
    <StyledPrayerList>
      <PrayerListItemsWrapper>
        {isEmpty(prayers) && <p>No prayers...</p>}

        {prayers.map((prayer) => (
          <PrayerListItem prayer={prayer} key={prayer.id} />
        ))}
      </PrayerListItemsWrapper>
    </StyledPrayerList>
  );
}
