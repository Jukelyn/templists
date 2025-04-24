"use client";

import { useEffect, useReducer, useRef } from "react";
import { TemplistCard } from "@/components/TemplistCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplistReducer } from "@/lib/utils/TemplistReducer";
import { useTemplistHandlers } from "@/lib/utils/TemplistHandlers";

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
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-black">
      <div className="pt-6">
        {templistCards.map((card) => (
          <TemplistCard
            key={card.templistId}
            templistId={card.templistId}
            items={card.items}
            onSave={(updatedItems) => handleSave(card.templistId, updatedItems)}
            onDelete={() => handleDelete(card.templistId)}
          />
        ))}
      </div>
      <div className="flex justify-center gap-4 pt-4">
        <Button onClick={handleAddTemplist}>
          <Plus className="mr-1 h-4 w-4" />
          Add New Templist
        </Button>
      </div>
    </div>
  );
}
