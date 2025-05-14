import { Option } from "@/types";
import { Category, db, TableNames } from "../database";
import { id } from "@instantdb/react";

const { CATEGORY } = TableNames;

export default function useCategories() {
  const { data, isLoading } = db.useQuery({
    [CATEGORY]: {},
  });

  const categories = (data?.[CATEGORY] ?? []) as Category[];

  const categoriesAsOptions = categories.map((category) => {
    return {
      label: category.name,
      value: category.id,
    };
  }) as Option[];

  async function addNewCategory(name: string) {
    const order = 0;
    const newCategoryData: Category = { order, name };
    const newId = id();
    await db.transact([db.tx[CATEGORY][newId].update({ ...newCategoryData })]);

    return { id: newId, ...newCategoryData } as Category;
  }

  return {
    categories,
    categoriesLoading: isLoading,
    categoriesAsOptions,
    addNewCategory,
  };
}
