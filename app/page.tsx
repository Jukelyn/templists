"use client";

import { useReducer, useRef, useEffect, useCallback } from "react";
import { TemplistCard } from "@/components/TemplistCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Templist, TemplistItem } from "@/types/templist";
import { toast } from "sonner";
import { ActionTypes } from "@/types/actions";

function reducer(state: Templist[], action: ActionTypes): Templist[] {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return [...action.templists].sort((a, b) => a.templistId - b.templistId);
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
    case "REMOVE_TEMPLIST":
      const templistToRemove = state.find(
        (t) => t.templistId === action.templistId,
      );
      if (!templistToRemove) {
        console.warn(
          `Templist with ID ${action.templistId} not found for removal.`,
        );

        throw Error(`Templist of id ${action.templistId} not found.`);
      }
      const currentSavedLists = localStorage.getItem("Templists");
      if (currentSavedLists) {
        try {
          const parsedData = JSON.parse(currentSavedLists) as {
            templists: Templist[];
          };
          const updatedTemplists = parsedData.templists.filter(
            (t) => t.templistId !== action.templistId,
          );
          localStorage.setItem(
            "Templists",
            JSON.stringify({ templists: updatedTemplists }),
          );
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }

      return state.filter((t) => t.templistId !== action.templistId);
    default:
      throw Error("Unknown action.");
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
    if (!isDataLoaded.current) {
      try {
        const storedData = localStorage.getItem("Templists");
        const initialData = storedData
          ? (JSON.parse(storedData) as { templists: Templist[] })
          : { templists: [] };

        if (initialData && Array.isArray(initialData.templists)) {
          dispatch({
            type: "SET_INITIAL_STATE",
            templists: initialData.templists,
          });

          nextId.current = getLastTemplistId(initialData.templists);
          isDataLoaded.current = true;
        } else {
          console.error(
            "Failed to load initial templists data or data format is incorrect.",
          );

          nextId.current = 0;
          isDataLoaded.current = true;
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        nextId.current = 0;
        isDataLoaded.current = true;
      }
    }
  }, []);

  const handleSave = useCallback(
    async (templistId: number, updatedItems: TemplistItem[]) => {
      try {
        const storedData = localStorage.getItem("Templists");
        const existingData = storedData
          ? (JSON.parse(storedData) as { templists: Templist[] })
          : { templists: [] };

        // Check if the templist already exists
        const templistExists = existingData.templists.some(
          (t) => t.templistId === templistId,
        );

        let updatedTemplists;

        if (templistExists) {
          // Update existing templist
          updatedTemplists = existingData.templists.map((t) =>
            t.templistId === templistId ? { ...t, items: updatedItems } : t,
          );
        } else {
          // Add new templist
          const newTemplist: Templist = {
            templistId: templistId,
            items: updatedItems,
          };
          updatedTemplists = [...existingData.templists, newTemplist];
        }

        localStorage.setItem(
          "Templists",
          JSON.stringify({ templists: updatedTemplists }),
        );

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

  const handleDelete = (templistId: number) => {
    // Modal here, confirm delete
    dispatch({ type: "REMOVE_TEMPLIST", templistId });
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
