import { Option } from "@/types";
import { db } from "@/database";
import { id } from "@instantdb/react";
import { isEmpty } from "lodash";
import { Category } from "@schema";

export default function useCategories() {
  const { data, isLoading } = db.useQuery({
    categories: {
      prayers: {},
      $: {
        order: {
          order: "asc",
        },
      },
    },
  });

  const categories = data?.categories ?? [];

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
    const newCategoryData: Partial<Category> = { order, name };
    const newId = id();
    await db.transact([db.tx.categories[newId].update({ ...newCategoryData })]);

    return { id: newId, ...newCategoryData };
  }

  async function deleteCategory(category: Category) {
    if (!category.id) return;
    await db.transact([db.tx.categories[category.id].delete()]);
  }

  async function editCategory(
    category: Category,
    newCategoryValues: Partial<Category>
  ) {
    if (!category.id) return;
    await db.transact([
      db.tx.categories[category.id].update({
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
