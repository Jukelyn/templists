import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutPanelLeft, Rows2, Grid2x2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/sidebar/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar/sidebar";
import { CommandShortcut } from "@/components/ui/search-bar/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useTemplistContext } from "@/components/ui/templist/TemplistContext";
import { LayoutType } from "@/components/ui/templist/TemplistContext";

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
  const { templistCards, changeLayout, layout } = useTemplistContext();

  function handleClick(layout: LayoutType) {
    changeLayout(layout);
  }

  return (
    <div className={cn("mt-4 flex items-center justify-end", className)}>
      <div className="hidden md:block">
        <ToggleGroup
          type="single"
          aria-label="Layout Selector"
          className="z-20 mr-2 rounded-lg border-2 border-current"
        >
          <ToggleGroupItem
            value="list"
            aria-label="List Layout"
            onClick={() => handleClick("list")}
            data-state={layout === "list" ? "on" : "off"}
          >
            <Rows2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="grid"
            aria-label="Grid Layout"
            onClick={() => handleClick("grid")}
            data-state={layout === "grid" ? "on" : "off"}
          >
            <Grid2x2 className="h-4 w-4" />
          </ToggleGroupItem>
          {templistCards.length > 3 && (
            <ToggleGroupItem
              value="masonry"
              aria-label="Masonry Layout"
              onClick={() => handleClick("masonry")}
              data-state={layout === "masonry" ? "on" : "off"}
            >
              <LayoutPanelLeft className="h-4 w-4" />
            </ToggleGroupItem>
          )}
        </ToggleGroup>
      </div>
      <SidebarTriggerWithToolTip />
    </div>
  );
}
