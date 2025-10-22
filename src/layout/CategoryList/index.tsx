import styled from "styled-components";
import ReorderableList from "@/layout/ReorderableList";
import { Reorderable, reorderReorderable } from "@/utils/";
import useCategories from "@/hooks/useCategories";
import DeleteButton from "@/components/DeleteButton";
import { CategoryListItem } from "./CategoryListItem";
import { Button } from "@/components/ui/button";

const StyledCategoryList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 12px;
`;

const PrayerListItemsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 4px;

  .item {
    border-bottom: 1px solid #ccc;
  }
`;

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
    <StyledCategoryList>
      <Button onClick={handleAddNewCategory}>Add New Category</Button>
      <PrayerListItemsWrapper>
        <ReorderableList
          items={categories}
          onReorder={handleOnReorder}
          renderItem={(item) => {
            return (
              <div className="item flex gap-[24px] py-[6px] items-center">
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
      </PrayerListItemsWrapper>
    </StyledCategoryList>
  );
}
