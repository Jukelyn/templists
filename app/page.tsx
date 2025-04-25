"use client";

import { useEffect, useReducer, useRef } from "react";
import { TemplistCard } from "@/components/TemplistCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplistReducer } from "@/lib/utils/TemplistReducer";
import { useTemplistHandlers } from "@/lib/utils/TemplistHandlers";
import { SidebarTrigger } from "@/components/ui/sidebar";
import TemplistSearchWrapper from "@/components/SearchWrapper";

export default function ChecklistApp() {
  const [templistCards, dispatch] = useReducer(TemplistReducer, []);
  const isDataLoaded = useRef(false);

  const { handleSave, handleAddTemplist, handleDelete, initializeTemplists } =
    useTemplistHandlers(dispatch);

  useEffect(() => {
    if (!isDataLoaded.current) {
      initializeTemplists();
      isDataLoaded.current = true;
    }
  }, [initializeTemplists]);

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
              <TemplistSearchWrapper />
            </>
          )}
          {templistCards.map((card) => (
            <TemplistCard
              key={card.templistId}
              templistId={card.templistId}
              items={card.items}
              onSave={(updatedItems) =>
                handleSave(card.templistId, updatedItems)
              }
              onDelete={() => handleDelete(card.templistId)}
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
