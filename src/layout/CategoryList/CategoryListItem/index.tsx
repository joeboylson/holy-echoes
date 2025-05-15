import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type _props = {
  name: string;
  onSave: (newName: string) => void;
};

export function CategoryListItem({ name, onSave }: _props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleSave = () => {
    onSave(value.trim());
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-[100px_1fr] gap-[12px] [align-items:center] w-full">
      {isEditing ? (
        <>
          <Button variant="secondary" onClick={handleSave}>
            Save
          </Button>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <p>{name}</p>
        </>
      )}
    </div>
  );
}
