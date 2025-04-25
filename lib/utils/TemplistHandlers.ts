import { useCallback } from "react";
import { Templist, TemplistItem } from "@/types/templist";
import { toast } from "sonner";
import { ActionTypes } from "@/types/actions";
import { ulid } from 'ulid';


export function useTemplistHandlers(dispatch: React.Dispatch<ActionTypes>) {

  const initializeTemplists = () => {
    const storedData = localStorage.getItem("Templists");
    const initialData = storedData
      ? (JSON.parse(storedData) as { templists: Templist[] })
      : { templists: [] };

    if (initialData && Array.isArray(initialData.templists)) {
      dispatch({ type: "SET_INITIAL_STATE", templists: initialData.templists });
    }
  };

  const handleSave = useCallback(
    (templistULID: string, updatedItems: TemplistItem[]) => {
      try {
        const storedData = localStorage.getItem("Templists");
        const existingData = storedData
          ? (JSON.parse(storedData) as { templists: Templist[] })
          : { templists: [] };

        const templistExists = existingData.templists.some(
          (t) => t.templistULID === templistULID,
        );

        const updatedTemplists = templistExists
          ? existingData.templists.map((t) =>
              t.templistULID === templistULID ? { ...t, items: updatedItems } : t,
            )
          : [
              ...existingData.templists,
              { templistULID, items: updatedItems } as Templist,
            ];

        localStorage.setItem(
          "Templists",
          JSON.stringify({ templists: updatedTemplists }),
        );

        dispatch({
          type: "UPDATE_ITEMS",
          templistULID,
          newItems: updatedItems,
        });

        toast.success(`Templist (ULID: ${templistULID}) successfully saved!`);
      } catch (error) {
        toast.error(`Error saving templists: ${error}`);
      }
    },
    [dispatch],
  );

  const handleAddTemplist = () => {
    const newId = ulid();
    const newTemplist: Templist = {
      templistULID: newId,
      items: [],
    };
    dispatch({ type: "ADD_TEMPLIST", newTemplist });
  };

  const handleDelete = (templistULID: string) => {
    dispatch({ type: "REMOVE_TEMPLIST", templistULID });
  };

  return {
    handleSave,
    handleAddTemplist,
    handleDelete,
    initializeTemplists,
  };
}
