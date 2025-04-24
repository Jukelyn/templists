import { useCallback, useRef } from "react";
import { Templist, TemplistItem } from "@/types/templist";
import { toast } from "sonner";
import { ActionTypes } from "@/types/actions";

const getLastTemplistId = (templists: Templist[]): number => {
  if (!templists || templists.length === 0) return 0;
  return Math.max(...templists.map((t) => t.templistId));
};

export function useTemplistHandlers(dispatch: React.Dispatch<ActionTypes>) {
  const nextId = useRef(0);

  const initializeTemplists = () => {
    const storedData = localStorage.getItem("Templists");
    const initialData = storedData
      ? (JSON.parse(storedData) as { templists: Templist[] })
      : { templists: [] };

    if (initialData && Array.isArray(initialData.templists)) {
      dispatch({ type: "SET_INITIAL_STATE", templists: initialData.templists });
      nextId.current = getLastTemplistId(initialData.templists);
    } else {
      nextId.current = 0;
    }
  };

  const handleSave = useCallback(
    (templistId: number, updatedItems: TemplistItem[]) => {
      try {
        const storedData = localStorage.getItem("Templists");
        const existingData = storedData
          ? (JSON.parse(storedData) as { templists: Templist[] })
          : { templists: [] };

        const templistExists = existingData.templists.some(
          (t) => t.templistId === templistId,
        );

        const updatedTemplists = templistExists
          ? existingData.templists.map((t) =>
              t.templistId === templistId ? { ...t, items: updatedItems } : t,
            )
          : [
              ...existingData.templists,
              { templistId, items: updatedItems } as Templist,
            ];

        localStorage.setItem(
          "Templists",
          JSON.stringify({ templists: updatedTemplists }),
        );

        dispatch({
          type: "UPDATE_ITEMS",
          templistId,
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
    dispatch({ type: "REMOVE_TEMPLIST", templistId });
  };

  return {
    handleSave,
    handleAddTemplist,
    handleDelete,
    initializeTemplists,
  };
}
