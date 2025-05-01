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

  const activeButtonStyle = "text-card bg-gray-300";

  return (
    <div className={cn("mt-4 flex items-center justify-end", className)}>
      <div className="hidden md:block">
        <div
          className="mr-2 flex flex-row rounded-lg border-2 border-current"
          aria-label="Layout Selector"
        >
          <Button
            variant="ghost"
            className={cn(layout === "list" && activeButtonStyle)}
            aria-label="List Layout"
            onClick={() => handleClick("list")}
          >
            <Rows2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className={cn(layout === "grid" && activeButtonStyle)}
            aria-label="Grid Layout"
            onClick={() => handleClick("grid")}
          >
            <Grid2x2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className={cn(
              templistCards.length > 3 ? "hidden lg:block" : "hidden",
              layout === "masonry" && activeButtonStyle,
            )}
            aria-label="Masonry Layout"
            onClick={() => handleClick("masonry")}
          >
            <LayoutPanelLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <SidebarTriggerWithToolTip />
    </div>
  );
}
