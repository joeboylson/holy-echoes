import { db, TableNames } from "../database";
import type { Category } from "../database/types";
import { first, orderBy, isEmpty } from "lodash";

const { CATEGORY, PRAYERS } = TableNames;

export default function useCategory(categoryId?: string, skip?: boolean) {
  // Get the specific category
  const { data: categoryData, isLoading: categoryLoading } = db.useQuery(
    categoryId && !skip
      ? {
          [CATEGORY]: {
            [PRAYERS]: {},
            $: {
              where: {
                id: categoryId,
              },
            },
          },
        }
      : null
  );

  const category = first((categoryData?.[CATEGORY] ?? []) as Category[]);

  // Get all categories ordered by order field to find prev/next
  const { data: allCategoriesData, isLoading: allCategoriesLoading } =
    db.useQuery(
      !skip
        ? {
            [CATEGORY]: {
              [PRAYERS]: {},
              $: {
                order: {
                  order: "asc",
                },
              },
            },
          }
        : null
    );

  const allCategories = orderBy(
    (allCategoriesData?.[CATEGORY] ?? []) as Category[],
    "order"
  );

  // Filter out categories without prayers before navigation
  const categoriesWithPrayers = allCategories.filter((category) => {
    return !isEmpty(category.prayers);
  });

  // Find current category index and get prev/next
  const currentIndex = categoriesWithPrayers.findIndex(
    (cat) => cat.id === categoryId
  );
  const prevCategory =
    currentIndex > 0 ? categoriesWithPrayers[currentIndex - 1] : undefined;
  const nextCategory =
    currentIndex < categoriesWithPrayers.length - 1
      ? categoriesWithPrayers[currentIndex + 1]
      : undefined;

  return {
    category,
    prevCategory,
    nextCategory,
    isLoading: !skip && (categoryLoading || allCategoriesLoading),
  };
}
