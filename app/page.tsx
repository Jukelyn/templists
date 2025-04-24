"use client";

import { useReducer, useRef, useEffect, useCallback } from "react";
import { TemplistCard } from "@/components/TemplistCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Templist, TemplistItem } from "@/types/templist";
import { toast } from "sonner";

type Action =
  | { type: "SET_INITIAL_STATE"; payload: Templist[] } // Action to load data
  | { type: "UPDATE_ITEMS"; templistId: number; newItems: TemplistItem[] }
  | { type: "ADD_TEMPLIST"; newTemplist: Templist };

function reducer(state: Templist[], action: Action): Templist[] {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.payload;
    case "UPDATE_ITEMS":
      return state.map((t) =>
        t.templistId === action.templistId
          ? { ...t, items: action.newItems }
          : t,
      );
    case "ADD_TEMPLIST":
      if (state.some((t) => t.templistId === action.newTemplist.templistId)) {
        console.warn(
          `Templist with ID ${action.newTemplist.templistId} already exists.`,
        );
        return state;
      }
      return [...state, action.newTemplist];
    default:
      // Should not happen with TypeScript, but good practice
      return state;
  }
}

const getLastTemplistId = (templists: Templist[]): number => {
  if (!templists || templists.length === 0) {
    return 0;
  }
  return Math.max(...templists.map((t) => t.templistId));
};

export default function ChecklistApp() {
  const [templistCards, dispatch] = useReducer(reducer, []);
  const isDataLoaded = useRef(false);
  const nextId = useRef(0);

  useEffect(() => {
    // Only load initial data once
    if (
      !isDataLoaded.current &&
      initialData &&
      Array.isArray(initialData.templists)
    ) {
      dispatch({ type: "SET_INITIAL_STATE", payload: initialData.templists });
      // Set the nextId based on the loaded data
      nextId.current = getLastTemplistId(initialData.templists);
      isDataLoaded.current = true; // Mark data as loaded
    } else if (!isDataLoaded.current) {
      console.error(
        "Failed to load initial templists data or data format is incorrect.",
      );

      nextId.current = 0; // Initialize nextId even if loading fails
      isDataLoaded.current = true;
    }
  }, []);

  const handleSave = useCallback(
    async (templistId: number, updatedItems: TemplistItem[]) => {
      const nextState = reducer(templistCards, {
        type: "UPDATE_ITEMS",
        templistId: templistId,
        newItems: updatedItems,
      });

      const dataToSave = { templists: nextState };

      try {
        const response = await fetch("/api/saveTemplists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        });

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(
            errorResult.message ||
              `Failed to save templists (${response.status})`,
          );
        }

        dispatch({
          type: "UPDATE_ITEMS",
          templistId: templistId,
          newItems: updatedItems,
        });

        toast.success(`Templist ${templistId} successfully saved!`);
      } catch (error) {
        toast.error(`Error saving templists: ${error}`);
      }
    },
    [dispatch],
  );

  const handleAddTemplist = () => {
    const newId = ++nextId.current;
    const newTemplist: Templist = {
      templistId: newId,
      items: [],
    };
    dispatch({ type: "ADD_TEMPLIST", newTemplist });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-black">
      <div className="pt-6">
        {templistCards.map((card) => (
          <TemplistCard
            key={card.templistId}
            templistId={card.templistId}
            items={card.items}
            onSave={(updatedItems) => handleSave(card.templistId, updatedItems)}
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
