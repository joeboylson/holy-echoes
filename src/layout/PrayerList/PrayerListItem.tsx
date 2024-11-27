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
  padding: 0 8px;

  display: grid;
  grid-template-columns: 2fr 150px 30px;
  gap: 12px;

  &.active {
    background-color: white;
  }

  a {
    display: block;
  }

  label {
    font-size: 12px;
  }
`;

const { PRAYERS } = TableNames;

interface _props {
  prayer: Prayer;
}

export default function PrayerListItem({ prayer }: _props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(prayer.name);
  const [isPublished, setIsPublished] = useState(prayer.published);

  const activateEditMode = () => setIsEditMode(true);

  const handleSave = async () => {
    const _id = prayer.id;
    if (!_id) return;
    setIsEditMode(false);

    const updatePrayer: Prayer = {
      published: isPublished,
      name,
    };

    await db.transact([db.tx[PRAYERS][_id].update({ ...updatePrayer })]);
  };

  const to = Pages.SELECTED_PRAYER.replace(":prayerId", prayer.id ?? "");
  const { prayerId } = useParams();

  const className = compact([
    prayerId === prayer.id ? "active" : null,
    isEditMode ? "edit" : null,
  ]).join(" ");

  return (
    <StyledPrayerListItem className={className}>
      {!isEditMode && (
        <>
          <Link to={to}>{prayer.name ?? "Unnamed Prayer"}</Link>
          <label>{isPublished ? "Published" : "Not Published"}</label>
          <button onClick={activateEditMode}>Edit</button>
        </>
      )}

      {isEditMode && (
        <>
          <input
            defaultValue={prayer.name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <Switch
              defaultChecked={prayer.published}
              size="small"
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <label>{isPublished ? "Published" : "Not Published"}</label>
          </div>
          <button onClick={handleSave}>Save</button>
        </>
      )}
    </StyledPrayerListItem>
  );
}
