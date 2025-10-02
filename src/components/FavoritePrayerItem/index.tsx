import styled from "styled-components";
import type { Favorite } from "@schema";
import { Link } from "react-router-dom";
import { Pages } from "@/layout/App/router";
import { isEmpty } from "lodash";
import { useMemo } from "react";

const StyledPrayerListItem = styled.div`
  position: relative;
  overflow: hidden;
  height: 36px;
  align-items: center;
  align-items: center;
  display: grid;

  &:hover,
  &.active {
    a {
      color: black;
      font-weight: bold;
    }
  }

  a {
    color: #555555;
    text-decoration: none;
    line-height: 36px;
  }
`;

const UnpublishedTag = styled.p`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 10px;
  margin: 6px;
  padding: 0 8px;
  line-height: 24px;
  pointer-events: none;
  background-color: var(--blue-10);
  color: white;
  text-transform: uppercase;
  border-radius: 36px;
`;

interface FavoritePrayerItemProps {
  favorite: Favorite;
}

export default function FavoritePrayerItem({
  favorite,
}: FavoritePrayerItemProps) {
  const to = useMemo(() => {
    return Pages.SELECTED_PRAYER.replace(":categoryId", "favorites").replace(
      ":prayerId",
      favorite.prayer?.id ?? ""
    );
  }, [favorite]);

  const prayerName = useMemo(
    () => (isEmpty(favorite.prayer?.name) ? "No Name" : favorite.prayer?.name),
    [favorite]
  );

  return (
    <StyledPrayerListItem>
      <Link to={to}>{prayerName}</Link>
      {!favorite.prayer?.published && (
        <UnpublishedTag>Not Published</UnpublishedTag>
      )}
    </StyledPrayerListItem>
  );
}
