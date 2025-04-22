"use client";

import { useState } from "react";
import { TemplistItem, TemplistCard } from "@/components/TemplistCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChecklistApp() {
  const [templistCards, setTemplistCards] = useState<
    { templistId: number; items: TemplistItem[] }[]
  >([
    {
      templistId: 1,
      items: [
        { itemId: "1", text: "Create a checklist app", completed: false },
        { itemId: "2", text: "Add edit functionality", completed: false },
        { itemId: "3", text: "Make it responsive", completed: false },
      ],
    },
  ]);

  const addTemplistCard = () => {
    const newId =
      templistCards.length > 0
        ? Math.max(...templistCards.map((card) => card.templistId)) + 1
        : 1;

    setTemplistCards([...templistCards, { templistId: newId, items: [] }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <div className="pt-6">
        {templistCards.map((card) => (
          <TemplistCard
            key={card.templistId}
            templistId={card.templistId}
            items={card.items}
            setItems={(newItems: TemplistItem[]) => {
              setTemplistCards(
                templistCards.map((c) =>
                  c.templistId === card.templistId
                    ? { ...c, items: newItems }
                    : c
                )
              );
            }}
          />
        ))}
      </div>
      <div className="flex justify-center pt-4">
        <Button onClick={addTemplistCard}>
          <Plus className="h-4 w-4 mr-1" />
          Add New Templist
        </Button>
      </div>
    </div>
  );
}
