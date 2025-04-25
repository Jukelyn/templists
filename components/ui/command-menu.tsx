import React from "react";

import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for a templist" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem>Templist 1</CommandItem>
          <CommandItem>Templist 2</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
