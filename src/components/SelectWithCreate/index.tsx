import { Check, PlusCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Option } from "@/types";

interface SelectWithCreateProps {
  className?: string;
  options: Option[];
  onCreate: (value: string) => void;
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectWithCreate({
  options,
  onCreate,
  onChange,
  value,
  placeholder = "Select an option...",
  disabled = false,
}: SelectWithCreateProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setOpen(false);
    setSearch("");
  };

  const handleCreate = () => {
    onCreate(search);
    setOpen(false);
    setSearch("");
  };

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const showCreate = search && !filtered.find((opt) => opt.label === search);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedOption?.label ?? placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Search or create..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {filtered.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option)}
              >
                {option.label}
                {option.value === value && (
                  <Check className="ml-auto h-4 w-4 opacity-50" />
                )}
              </CommandItem>
            ))}
            {showCreate && (
              <CommandItem onSelect={handleCreate} className="text-primary">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create “{search}”
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
