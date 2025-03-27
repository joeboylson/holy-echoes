import styled from "styled-components";
import { db, Prayer, TableNames } from "../../database";
import PrayerListItem from "./PrayerListItem";
import { first, isEmpty, isEqual, orderBy } from "lodash";
import { useMemo } from "react";
import { moveBlockDown, moveBlockUp } from "../../utils";
import { ArrowFatDown, ArrowFatUp } from "@phosphor-icons/react";

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

const PrayerListItemWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 24px 24px;
  align-content: start;
  gap: 4px;

  button {
    padding: 0;
    margin: 0;
    background-color: transparent;
    border: none;
  }
`;

const { PRAYERS } = TableNames;

interface _props {
  filterUnpublished?: boolean;
  showFilters?: boolean;
  hideControls?: boolean;
}

export default function PrayerList({
  filterUnpublished = true,
  showFilters = false,
  hideControls = true,
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

  const orderedPrayers = orderBy(prayers, "order");

  return (
    <StyledPrayerList>
      <PrayerListItemsWrapper>
        {isEmpty(orderedPrayers) && <p>No prayers...</p>}

        {orderedPrayers.map((prayer, index) => {
          const moveUp = () => moveBlockUp(prayer, orderedPrayers, PRAYERS);
          const moveDown = () => moveBlockDown(prayer, orderedPrayers, PRAYERS);
          const isFirstItem = index === 0;
          const isLastItem = index + 1 === orderedPrayers.length;

          return (
            <PrayerListItemWrapper key={prayer.id}>
              <PrayerListItem prayer={prayer} />

              {!hideControls && (
                <>
                  {isFirstItem ? (
                    <span />
                  ) : (
                    <button onClick={moveUp}>
                      <ArrowFatUp
                        size={20}
                        weight="duotone"
                        color="var(--blue-10)"
                      />
                    </button>
                  )}

                  {isLastItem ? (
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
                </>
              )}
            </PrayerListItemWrapper>
          );
        })}
      </PrayerListItemsWrapper>
    </StyledPrayerList>
  );
}
