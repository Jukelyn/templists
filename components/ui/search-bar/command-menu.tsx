import React from "react";

import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/search-bar/command";

import { Templist } from "@/types/templist";
import Link from "next/link";
interface CommandMenuProps {
  templists: Templist[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandMenu({ templists, open, setOpen }: CommandMenuProps) {
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

  const titleCount: Record<string, number> = {};

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for a templist" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {templists.map((templist) => {
            let displayTitle: string;

            if (templist.title === "") {
              displayTitle = `${templist.ulid.slice(-6)} (${templist.ulid})`;
            } else {
              if (titleCount[templist.title]) {
                titleCount[templist.title]++;
                displayTitle = `${templist.title} (${titleCount[templist.title]})`;
              } else {
                titleCount[templist.title] = 1;
                displayTitle = templist.title;
              }
            }

            return (
              <Link
                href={`#${templist.ulid}`}
                key={templist.ulid}
                className="w-full"
                onClick={() => setOpen(!open)}
              >
                <CommandItem>{displayTitle}</CommandItem>
              </Link>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
