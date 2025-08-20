import styled from "styled-components";
import type { Prayer } from "@schema";
import { Link, useParams } from "react-router-dom";
import { Pages } from "../App/router";
import { compact, isEmpty } from "lodash";
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

interface _props {
  prayer: Prayer;
}

export default function PrayerListItem({ prayer }: _props) {
  const { categoryId } = useParams();

  const to = useMemo(() => {
    const { SELECTED_ADMIN_PRAYER, SELECTED_PRAYER, HOME } = Pages;
    const currentRoute = window.location.pathname;
    const route = currentRoute.includes("admin")
      ? SELECTED_ADMIN_PRAYER
      : SELECTED_PRAYER;

    // For category-aware routes, require category ID or redirect to home
    if (route === SELECTED_PRAYER) {
      if (!categoryId) return HOME;
      return route
        .replace(":categoryId", categoryId)
        .replace(":prayerId", prayer.id ?? "");
    }

    return route.replace(":prayerId", prayer.id ?? "");
  }, [prayer, categoryId]);

  const { prayerId } = useParams();

  const className = compact([prayerId === prayer.id ? "active" : null]).join(
    " "
  );

  const prayerName = useMemo(
    () => (isEmpty(prayer.name) ? "No Name" : prayer.name),
    [prayer]
  );

  return (
    <StyledPrayerListItem className={className}>
      <Link to={to}>{prayerName}</Link>
      {!prayer.published && <UnpublishedTag>Not Published</UnpublishedTag>}
    </StyledPrayerListItem>
  );
}
