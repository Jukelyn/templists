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
      {templistCards.length > 0 && (
        <div className="flex flex-col items-center pt-6">
          <TemplistSearchWrapper templists={templistCards} />
        </div>
      )}
      {layout === "grid" && (
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-[1848px]">
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,450px))] items-start justify-center gap-4">
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
        </div>
      )}
      {layout === "masonry" && (
        <div className="mt-6 w-full max-w-[1848px]">
          {/* Masonry layout (using CSS columns), capped at 4 columns via maxWidth of container */}
          <div
            className="w-full"
            style={{
              maxWidth: "1848px", // 4 columns * 450px + gap space
              columnWidth: "450px",
              columnGap: "1rem",
            }}
          >
            {templistCards.map((card) => (
              <div key={card.ulid} className="mb-4 break-inside-avoid">
                <TemplistCard
                  ulid={card.ulid}
                  title={card.title}
                  items={card.items}
                  onSave={(updatedItems) => handleSave(card.ulid, updatedItems)}
                  onDelete={() => handleDelete(card.ulid)}
                  onTitleChange={(newTitle) =>
                    handleTitleChange(card.ulid, newTitle)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {layout === "list" && (
        <div className="mt-6 flex justify-center">
          {/* Regular list layout */}
          <div className="flex w-full max-w-5xl flex-col items-center space-y-4">
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
      )}
      <div className="flex w-full justify-center gap-4 pt-4">
        <Button onClick={handleAddTemplist}>
          <Plus className="mr-1 h-4 w-4" />
          Add New Templist
        </Button>
      </div>
    </div>
  );
}
