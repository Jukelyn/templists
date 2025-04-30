"use client";

import { useTemplistContext } from "@/components/ui/templist/TemplistContext";
import { TemplistCard } from "@/components/ui/templist/TemplistCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TemplistSearchWrapper from "@/components/ui/search-bar/SearchWrapper";
import { SidebarTriggerWithToolTip } from "@/components/ui/tooltip";

export default function ChecklistApp() {
  const {
    templistCards,
    handleSave,
    handleAddTemplist,
    handleDelete,
    handleTitleChange,
    layout,
  } = useTemplistContext();

  return (
    <div className="min-h-screen p-6 md:p-4 lg:p-2 dark:bg-black">
      <div className="flex flex-col items-end">
        <SidebarTriggerWithToolTip />
      </div>
      {/* tf somebody gonna search for where there is nothing??? */}
      {templistCards.length > 0 && (
        <div className="flex flex-col items-center pt-6">
          <TemplistSearchWrapper templists={templistCards} />
        </div>
      )}
      <div className="mt-6 flex justify-center">
        <div
          className={
            layout === "grid"
              ? "grid w-full grid-cols-[repeat(auto-fit,minmax(250px,450px))] justify-center gap-4"
              : "flex w-full flex-col items-center space-y-4"
          }
        >
          {templistCards.map((card) => (
            <TemplistCard
              key={card.ulid}
              ulid={card.ulid}
              title={card.title}
              items={card.items}
              onSave={(updatedItems) => handleSave(card.ulid, updatedItems)}
              onDelete={() => handleDelete(card.ulid)}
              onTitleChange={(newTitle) =>
                handleTitleChange(card.ulid, newTitle)
              }
            />
          ))}
        </div>
      </div>
      <div className="flex w-full justify-center gap-4 pt-4">
        <Button onClick={handleAddTemplist}>
          <Plus className="mr-1 h-4 w-4" />
          Add New Templist
        </Button>
      </div>
    </div>
  );
}
