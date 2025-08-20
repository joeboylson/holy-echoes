import { db } from "@/database";
import { first, isEmpty } from "lodash";

export default function useCategory(categoryId?: string, skip?: boolean) {
  // Get the specific category
  const { data: categoryData, isLoading: categoryLoading } = db.useQuery(
    categoryId && !skip
      ? {
          categories: {
            prayers: {},
            $: {
              where: {
                id: categoryId,
              },
            },
          },
        }
      : null
  );

  const category = first(categoryData?.categories ?? []);

  // Get all categories ordered by order field to find prev/next
  const { data: allCategoriesData, isLoading: allCategoriesLoading } =
    db.useQuery(
      !skip
        ? {
            categories: {
              prayers: {},
              $: {
                order: {
                  order: "asc",
                },
              },
            },
          }
        : null
    );

  const allCategories = allCategoriesData?.categories ?? [];

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
