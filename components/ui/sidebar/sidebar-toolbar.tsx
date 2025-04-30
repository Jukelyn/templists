import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutPanelLeft, Rows2, Grid2x2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/sidebar/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar/sidebar";
import { CommandShortcut } from "@/components/ui/search-bar/command";

function SidebarTriggerWithToolTip() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(true);

  const handleOpenChange = (openState: boolean) => {
    setIsTooltipOpen(openState);
  };

  return (
    <Tooltip open={isTooltipOpen} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>
        <SidebarTrigger />
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <CommandShortcut className="text-primary text-sm">⌘B</CommandShortcut>
      </TooltipContent>
    </Tooltip>
  );
}

export default function SidebarToolbar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 flex items-center justify-end", className)}>
      <div className="ml-2 flex flex-row" aria-label="Layout Selector">
        <Button
          variant="ghost"
          className="text-mauve11 hover:bg-violet3 hover:text-violet11 focus:shadow-violet7 data-[state=on]:bg-violet5 data-[state=on]:text-violet11 ml-0.5 inline-flex h-[25px] flex-shrink-0 flex-grow-0 basis-auto items-center justify-center rounded bg-black px-[5px] text-[13px] leading-none outline-none first:ml-0 focus:relative focus:shadow-[0_0_0_2px]"
          aria-label="List Layout"
        >
          <Rows2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="text-mauve11 hover:bg-violet3 hover:text-violet11 focus:shadow-violet7 data-[state=on]:bg-violet5 data-[state=on]:text-violet11 ml-0.5 inline-flex h-[25px] flex-shrink-0 flex-grow-0 basis-auto items-center justify-center rounded bg-black px-[5px] text-[13px] leading-none outline-none focus:relative focus:shadow-[0_0_0_2px]"
          aria-label="Grid Layout"
        >
          <Grid2x2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="text-mauve11 hover:bg-violet3 hover:text-violet11 focus:shadow-violet7 data-[state=on]:bg-violet5 data-[state=on]:text-violet11 ml-0.5 inline-flex h-[25px] flex-shrink-0 flex-grow-0 basis-auto items-center justify-center rounded bg-black px-[5px] text-[13px] leading-none outline-none focus:relative focus:shadow-[0_0_0_2px]"
          aria-label="Masonry Layout"
        >
          <LayoutPanelLeft className="h-4 w-4" />
        </Button>
      </div>
      <SidebarTriggerWithToolTip />
    </div>
  );
}
