import React from "react";

import SearchBar from "@/components/ui/search-bar/search";
import { CommandMenu } from "@/components/ui/search-bar/command-menu";
import { Templist } from "@/types/templist";

interface Props {
  templists: Templist[];
}

export default function TemplistSearchWrapper({ templists }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="w-full max-w-md">
        <SearchBar handleClick={() => setOpen(true)} />
      </div>
      <CommandMenu templists={templists} open={open} setOpen={setOpen} />
    </>
  );
}
