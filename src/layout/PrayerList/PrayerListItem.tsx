import styled from "styled-components";
import { db, Prayer, TableNames } from "../../database";
import { Link, useParams } from "react-router-dom";
import { Pages } from "../App";
import { compact } from "lodash";
import { useState } from "react";
import { Switch } from "@mui/material";

const StyledPrayerListItem = styled.div`
  border-radius: 8px;
  border: 1px solid #ddd;
  overflow: hidden;
  height: 36px;
  align-items: center;

  display: grid;
  align-items: center;

  &.active {
    background-color: #c9c9c9;
  }

  a {
    color: #222222;
    text-decoration: none;
    padding: 0 8px;
  }
`;

interface _props {
  prayer: Prayer;
}

export default function PrayerListItem({ prayer }: _props) {
  const to = Pages.SELECTED_PRAYER.replace(":prayerId", prayer.id ?? "");
  const { prayerId } = useParams();

  const className = compact([prayerId === prayer.id ? "active" : null]).join(
    " "
  );

  return (
    <StyledPrayerListItem className={className}>
      <Link to={to}>{prayer.name ?? "No Name"}</Link>
    </StyledPrayerListItem>
  );
}
