import { Option } from "@/types";
import { db, TableNames } from "../database";
import type { Category } from "../database/types";
import { id } from "@instantdb/react";
import { isEmpty } from "lodash";

const { CATEGORY, PRAYERS } = TableNames;

export default function useCategories() {
  const { data, isLoading } = db.useQuery({
    [CATEGORY]: {
      [PRAYERS]: {},
      $: {
        order: {
          order: "asc",
        },
      },
    },
  });

  const categories = (data?.[CATEGORY] ?? []) as Category[];

  const categoriesAsOptions = categories.map((category) => {
    return {
      label: category.name,
      value: category.id,
    };
  }) as Option[];

  const categoriesWithPrayers = categories.filter((category) => {
    return !isEmpty(category.prayers);
  });

  async function addNewCategory(name: string) {
    const order = categories.length;
    const newCategoryData: Category = { order, name };
    const newId = id();
    await db.transact([db.tx[CATEGORY][newId].update({ ...newCategoryData })]);

    return { id: newId, ...newCategoryData };
  }

  async function deleteCategory(category: Category) {
    if (!category.id) return;
    await db.transact([db.tx[CATEGORY][category.id].delete()]);
  }

  async function editCategory(
    category: Category,
    newCategoryValues: Partial<Category>
  ) {
    if (!category.id) return;
    await db.transact([
      db.tx[CATEGORY][category.id].update({
        ...newCategoryValues,
      }),
    ]);
  }

  return {
    categories,
    categoriesWithPrayers,
    categoriesLoading: isLoading,
    categoriesAsOptions,
    addNewCategory,
    deleteCategory,
    editCategory,
  };
}
