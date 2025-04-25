import React from "react";

import SearchBar from "@/components/ui/search";
import { CommandMenu } from "@/components/ui/command-menu";

export default function TemplistSearchWrapper() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="w-full max-w-md">
        <SearchBar handleClick={() => setOpen(true)} />
      </div>
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
}
