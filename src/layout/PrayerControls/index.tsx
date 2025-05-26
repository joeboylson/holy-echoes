import { db, Prayer, TableNames } from "../../database";
import { id } from "@instantdb/react";
import { Pages } from "../App/router";
import { useNavigate } from "react-router-dom";
import AddNewButton from "../../components/AddNewButton";
import {
  ControlRow,
  ControlRowWrapper,
  StyledPrayerControls,
} from "./StyledComponents";
import { cascadeDeletePrayer } from "../../utils";
import DeleteButton from "../../components/DeleteButton";
import { debounce } from "lodash";
import { Switch } from "@/components/ui/switch";
import { SelectWithCreate } from "@/components/SelectWithCreate";
import { useState } from "react";
import useCategories from "@/hooks/useCategories";

const { PRAYERS } = TableNames;

interface _props {
  prayer?: Prayer;
}

export default function PrayerControls({ prayer }: _props) {
  const navigate = useNavigate();

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(prayer?.category?.id);

  const { categoriesAsOptions, categoriesLoading, addNewCategory } =
    useCategories();

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { data, isLoading } = db.useQuery({
    [PRAYERS]: {},
  });

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];

  const handleNameChange = debounce((name: string) => {
    if (!prayer) return;
    const _id = prayer.id;
    if (!_id) return;
    db.transact([db.tx[PRAYERS][_id].update({ name })]);
  }, 1000);

  const handleIsPublishedChange = async (published: boolean) => {
    if (!prayer) return;
    const _id = prayer.id;
    if (!_id) return;
    setIsSaving(true);
    await db
      .transact([db.tx[PRAYERS][_id].update({ published })])
      .finally(() => setIsSaving(false));
  };

  async function addNewPrayer() {
    if (!prayers) return;

    const order = prayers?.length;
    const newPrayer: Prayer = {
      order,
      name: `New Prayer`,
      published: false,
    };

    const newId = id();
    await db.transact([db.tx[PRAYERS][newId].update({ ...newPrayer })]);

    const to = Pages.SELECTED_ADMIN_PRAYER.replace(":prayerId", newId);
    navigate(to);
  }

  async function deletePrayer() {
    if (!prayer) return;
    db.transact([db.tx[PRAYERS][prayer?.id ?? ""].delete()]);
    cascadeDeletePrayer(prayer);
  }

  async function updatePrayerCategory(categoryId: string) {
    if (!prayer) return;
    const _id = prayer.id;
    if (!_id) return;
    setIsSaving(true);
    await db
      .transact([db.tx[PRAYERS][_id].link({ category: categoryId })])
      .finally(() => {
        setIsSaving(false);
        setSelectedCategoryId(categoryId);
      });
  }

  async function handleAddNewCategory(name: string) {
    const newCategory = await addNewCategory(name);
    if (newCategory.id) updatePrayerCategory(newCategory.id);
  }

  if (isLoading) return <span />;

  return (
    <StyledPrayerControls>
      <AddNewButton onClick={addNewPrayer} itemName="Prayer" />

      {prayer && (
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
            <p>Category:</p>
            <SelectWithCreate
              placeholder={"Select a category"}
              onChange={updatePrayerCategory}
              onCreate={handleAddNewCategory}
              options={categoriesAsOptions}
              disabled={categoriesLoading}
              value={selectedCategoryId}
            />
          </ControlRow>

          <ControlRow>
            <p>{prayer.published ? "Published:" : "Not Published:"}</p>
            <Switch
              checked={prayer.published}
              onCheckedChange={handleIsPublishedChange}
              disabled={isSaving}
            />
          </ControlRow>

          <ControlRow>
            <p>Delete Prayer:</p>
            <DeleteButton onClick={deletePrayer} itemName="Prayer" />
          </ControlRow>
        </ControlRowWrapper>
      )}
    </StyledPrayerControls>
  );
}
