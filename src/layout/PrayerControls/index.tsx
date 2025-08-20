import { db } from "@/database";
import type { Prayer } from "@schema";
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
import { compact, debounce } from "lodash";
import { Switch } from "@/components/ui/switch";
import { SelectWithCreate } from "@/components/SelectWithCreate";
import { useState } from "react";
import useCategories from "@/hooks/useCategories";

interface _props {
  prayer?: Prayer;
}

export default function PrayerControls({ prayer }: _props) {
  const navigate = useNavigate();

  const defaultSelectedCategoryIds = compact(
    prayer?.categories?.map((i) => i.id)
  );

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    defaultSelectedCategoryIds ?? []
  );

  const { categoriesAsOptions, categoriesLoading, addNewCategory } =
    useCategories();

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { data, isLoading } = db.useQuery({
    prayers: {},
  });

  const prayers = data?.prayers ?? [];

  const handleNameChange = debounce((name: string) => {
    if (!prayer) return;
    const _id = prayer.id;
    if (!_id) return;
    db.transact([db.tx.prayers[_id].update({ name })]);
  }, 1000);

  const handleIsPublishedChange = async (published: boolean) => {
    if (!prayer) return;
    const _id = prayer.id;
    if (!_id) return;
    setIsSaving(true);
    await db
      .transact([db.tx.prayers[_id].update({ published })])
      .finally(() => setIsSaving(false));
  };

  async function addNewPrayer() {
    if (!prayers) return;

    const order = prayers?.length;
    const newPrayer: Partial<Prayer> = {
      order,
      name: `New Prayer`,
      published: false,
    };

    const newId = id();
    await db.transact([db.tx.prayers[newId].update({ ...newPrayer })]);

    const to = Pages.SELECTED_ADMIN_PRAYER.replace(":prayerId", newId);
    navigate(to);
  }

  async function deletePrayer() {
    if (!prayer) return;
    db.transact([db.tx.prayers[prayer?.id ?? ""].delete()]);
    cascadeDeletePrayer(prayer);
  }

  async function addPrayerCategory(categoryId: string) {
    if (!prayer) return;
    const _id = prayer.id;
    if (!_id) return;
    setIsSaving(true);
    await db
      .transact([db.tx.prayers[_id].link({ categories: [categoryId] })])
      .finally(() => {
        setIsSaving(false);
        setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
      });
  }

  async function removePrayerCategory(categoryId: string) {
    if (!prayer) return;
    const _id = prayer.id;
    if (!_id) return;
    setIsSaving(true);
    await db
      .transact([db.tx.prayers[_id].unlink({ categories: [categoryId] })])
      .finally(() => {
        const _filtered = selectedCategoryIds.filter((i) => i !== categoryId);
        setSelectedCategoryIds(_filtered);
        setIsSaving(false);
      });
  }

  async function handleAddNewCategory(name: string) {
    const newCategory = await addNewCategory(name);
    if (newCategory.id) addPrayerCategory(newCategory.id);
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

          <hr />

          <ControlRow>
            <p>Categories:</p>
            <SelectWithCreate
              placeholder={"+ Add a category"}
              onSelect={addPrayerCategory}
              onDeselect={removePrayerCategory}
              onCreate={handleAddNewCategory}
              options={categoriesAsOptions}
              disabled={categoriesLoading || isSaving}
              values={selectedCategoryIds}
            />
          </ControlRow>
        </ControlRowWrapper>
      )}
    </StyledPrayerControls>
  );
}
