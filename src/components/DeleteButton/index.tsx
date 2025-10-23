import { TrashSimple as TrashSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface _props {
  itemName: string;
  onClick: () => void;
  icon?: boolean;
}

export default function DeleteButton({
  itemName,
  onClick,
  icon = false,
}: _props) {
  if (icon) {
    return (
      <Button
        variant="link"
        size="icon"
        onClick={onClick}
        className="!bg-transparent !p-0 !h-[20px] !w-[20px] hover:!bg-transparent"
      >
        <TrashSimpleIcon
          size={20}
          weight="duotone"
          color="var(--red-10)"
        />
      </Button>
    );
  }

  return (
    <Button variant="destructive" onClick={onClick}>
      Delete {itemName}
      <TrashSimpleIcon size={16} weight="duotone" />
    </Button>
  );
}
