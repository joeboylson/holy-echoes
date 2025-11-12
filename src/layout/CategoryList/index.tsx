import ReorderableList from "@/layout/ReorderableList";
import { Reorderable, reorderReorderable } from "@/utils/";
import useCategories from "@/hooks/useCategories";
import DeleteButton from "@/components/DeleteButton";
import { CategoryListItem } from "./CategoryListItem";
import { Button } from "@/components/ui/button";

export default function CategoriesList() {
  const {
    categories,
    categoriesLoading,
    deleteCategory,
    editCategory,
    addNewCategory,
  } = useCategories();
  if (categoriesLoading) return <span />;

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, "categories");
  };

  const handleAddNewCategory = () => addNewCategory("New Category");

  return (
    <div className="grid grid-cols-1 content-start gap-3">
      <Button onClick={handleAddNewCategory}>Add New Category</Button>
      <div className="w-full grid grid-cols-1 content-start gap-1">
        <ReorderableList
          items={categories}
          onReorder={handleOnReorder}
          renderItem={(item) => {
            return (
              <div className="flex gap-6 py-1.5 items-center border-b border-gray-300">
                <DeleteButton
                  itemName="Category"
                  onClick={() => deleteCategory(item)}
                  icon
                />

                <CategoryListItem
                  name={item.name ?? "(empty)"}
                  onSave={(name) => editCategory(item, { name })}
                />
              </div>
            );
          }}
          enabled={true}
        />
      </div>
    </div>
  );
}
