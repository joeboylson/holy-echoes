import { Plus as PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface _props {
  itemName: string;
  onClick: () => void;
}

export default function AddNewButton({ itemName, onClick }: _props) {
  return (
    <Button variant="success" onClick={onClick}>
      Add New {itemName}
      <PlusIcon size={16} />
    </Button>
  );
}
