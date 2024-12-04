import { useState } from "react";
import { db, Prayer, TableNames } from "../../database";
import { debounce, Switch } from "@mui/material";
import { id } from "@instantdb/react";
import { Pages } from "../App";
import { useNavigate } from "react-router-dom";
import AddNewButton from "../../components/AddNewButton";
import {
  ControlRow,
  ControlRowWrapper,
  StyledPrayerControls,
} from "./StyledComponents";
import { cascadeDeletePrayer } from "../../utils";
import DeleteButton from "../../components/DeleteButton";

const { PRAYERS } = TableNames;

interface _props {
  prayer: Prayer;
  allPrayers: Prayer[];
}

export default function PrayerControls({ prayer, allPrayers }: _props) {
  const navigate = useNavigate();

  const handleNameChange = debounce((name: string) => {
    const _id = prayer.id;
    if (!_id) return;
    db.transact([db.tx[PRAYERS][_id].update({ name })]);
  }, 500);

  const handleIsPublishedChange = (published: boolean) => {
    const _id = prayer.id;
    if (!_id) return;
    db.transact([db.tx[PRAYERS][_id].update({ published })]);
  };

  async function addNewPrayer() {
    const order = allPrayers?.length;
    const newPrayer: Prayer = {
      order,
      name: `New Prayer #${order + 1}`,
      published: false,
    };

    const newId = id();
    await db.transact([db.tx[PRAYERS][newId].update({ ...newPrayer })]);

    const to = Pages.SELECTED_PRAYER.replace(":prayerId", newId);
    navigate(to);
  }

  async function deletePrayer() {
    if (prayer) {
      db.transact([db.tx[PRAYERS][prayer?.id ?? ""].delete()]);
      cascadeDeletePrayer(prayer);
    }
  }

  return (
    <StyledPrayerControls>
      <AddNewButton onClick={addNewPrayer} itemName="Prayer" />

      <ControlRowWrapper>
        <b>Edit Prayer Information:</b>
        <ControlRow>
          <p>Prayer Name:</p>
          <input
            defaultValue={prayer.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </ControlRow>

        <ControlRow>
          <p>{prayer.published ? "Published" : "Not Published"}</p>
          <Switch
            defaultChecked={prayer.published}
            size="small"
            onChange={(e) => handleIsPublishedChange(e.target.checked)}
          />
        </ControlRow>

        <ControlRow>
          <p>Delete Prayer</p>
          <DeleteButton onClick={deletePrayer} itemName="Prayer" />
        </ControlRow>
      </ControlRowWrapper>
    </StyledPrayerControls>
  );
}
