import { useCallback } from "react";
import { Templist, TemplistItem } from "@/types/templist";
import { toast } from "sonner";
import { ActionTypes } from "@/types/actions";
import { ulid } from "ulid";

export function useTemplistHandlers(
  dispatch: React.Dispatch<ActionTypes>,
  setSavedTemplists: React.Dispatch<React.SetStateAction<Templist[]>>,
) {
  const initializeTemplists = useCallback(() => {
    const storedData = localStorage.getItem("Templists");
    const initialData = storedData
      ? (JSON.parse(storedData) as { templists: Templist[] })
      : { templists: [] };

    if (initialData && Array.isArray(initialData.templists)) {
      const templists = initialData.templists;
      dispatch({ type: "SET_INITIAL_STATE", templists });
      setSavedTemplists(templists);
    } else {
      dispatch({ type: "SET_INITIAL_STATE", templists: [] });
      setSavedTemplists([]);
    }
  }, [dispatch, setSavedTemplists]);
  const handleSave = useCallback(
    (templistULID: string, updatedItems: TemplistItem[]) => {
      try {
        const storedData = localStorage.getItem("Templists");
        const existingData = storedData
          ? (JSON.parse(storedData) as { templists: Templist[] })
          : { templists: [] };

        const existingTemplistsArray = Array.isArray(existingData.templists)
          ? existingData.templists
          : [];

        const templistIndex = existingTemplistsArray.findIndex(
          (t) => t.templistULID === templistULID,
        );

        let updatedTemplistsArray: Templist[];

        if (templistIndex > -1) {
          // Update existing templist
          updatedTemplistsArray = existingTemplistsArray.map((t, index) =>
            index === templistIndex ? { ...t, items: updatedItems } : t,
          );
        } else {
          // Add new templist if it doesn't exist (though usually add happens before save)
          updatedTemplistsArray = [
            ...existingTemplistsArray,
            { templistULID, items: updatedItems } as Templist,
          ];
        }

        // Save to localStorage
        localStorage.setItem(
          "Templists",
          JSON.stringify({ templists: updatedTemplistsArray }),
        );

        // Dispatch action to update the working state (templistCards)
        dispatch({
          type: "UPDATE_ITEMS",
          templistULID,
          newItems: updatedItems,
        });

        // Explicitly update the saved state after saving to localStorage
        setSavedTemplists(updatedTemplistsArray);

        toast.success(`Templist (ULID: ${templistULID}) successfully saved!`);
      } catch (error) {
        toast.error(`Error saving templists: ${error}`);
      }
    },
    [dispatch, setSavedTemplists],
  );

  // handleAddTemplist only adds to the working state, NOT directly to localStorage
  // It should NOT update the savedTemplists state here.
  const handleAddTemplist = useCallback(() => {
    const newId = ulid();
    const newTemplist: Templist = {
      templistULID: newId,
      items: [],
    };
    dispatch({ type: "ADD_TEMPLIST", newTemplist });
  }, [dispatch]);

  const handleDelete = useCallback(
    (templistULID: string) => {
      dispatch({ type: "REMOVE_TEMPLIST", templistULID });

      try {
        const storedData = localStorage.getItem("Templists");
        let updatedTemplists: Templist[] = [];
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData) as {
              templists: Templist[];
            };
            updatedTemplists = (parsedData.templists || []).filter(
              (t) => t.templistULID !== templistULID,
            );
            localStorage.setItem(
              "Templists",
              JSON.stringify({ templists: updatedTemplists }),
            );
          } catch (error) {
            console.error(
              "Error parsing or updating localStorage during delete:",
              error,
            );
          }
        } else {
          // If localStorage was empty, just ensure updatedTemplists is empty
          updatedTemplists = [];
        }

        // Dispatch action to remove from the working state (templistCards)
        dispatch({ type: "REMOVE_TEMPLIST", templistULID }); // Keep dispatching to update working state

        // Explicitly update the saved state after deleting from localStorage
        setSavedTemplists(updatedTemplists); // Update the saved state

        toast.success(`Templist (ULID: ${templistULID}) successfully deleted!`);
      } catch (error) {
        toast.error(`Error deleting templists: ${error}`);
      }
    },
    [dispatch, setSavedTemplists],
  );

  return {
    handleSave,
    handleAddTemplist,
    handleDelete,
    initializeTemplists,
  };
}
