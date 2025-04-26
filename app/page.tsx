"use client";

import { useTemplistContext } from "@/components/ui/templist/TemplistContext";
import { TemplistCard } from "@/components/ui/templist/TemplistCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar/sidebar";
import TemplistSearchWrapper from "@/components/ui/search-bar/SearchWrapper";

export default function ChecklistApp() {
  const {
    templistCards,
    handleSave,
    handleAddTemplist,
    handleDelete,
    handleTitleChange,
  } = useTemplistContext();

  return (
    <>
      <div className="min-h-screen p-6 md:p-4 lg:p-2 dark:bg-black">
        <div className="flex flex-col items-end">
          <SidebarTrigger />
        </div>
        <div className="flex flex-col items-center pt-6">
          {/* tf somebody gonna search for where there is nothing??? */}
          {templistCards.length > 0 && (
            <>
              <TemplistSearchWrapper templists={templistCards} />
            </>
          )}
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
        <div className="flex w-full justify-center gap-4 pt-4">
          <Button onClick={handleAddTemplist}>
            <Plus className="mr-1 h-4 w-4" />
            Add New Templist
          </Button>
        </div>
      </div>
    </>
  );
}
