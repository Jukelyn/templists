"use client";

import { useTemplistContext } from "@/components/TemplistContext";
import { TemplistCard } from "@/components/TemplistCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import TemplistSearchWrapper from "@/components/SearchWrapper";

export default function ChecklistApp() {
  const { templistCards, handleSave, handleAddTemplist, handleDelete } =
    useTemplistContext();

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
              key={card.templistULID}
              templistULID={card.templistULID}
              items={card.items}
              onSave={(updatedItems) =>
                handleSave(card.templistULID, updatedItems)
              }
              onDelete={() => handleDelete(card.templistULID)}
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
