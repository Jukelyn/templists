import { useCallback } from "react";
import { Templist, TemplistItem } from "@/types/templist";
import { toast } from "sonner";
import { ActionTypes } from "@/types/actions";
import { ulid } from "ulid";

export function useTemplistHandlers(
  dispatch: React.Dispatch<ActionTypes>,
  setSavedTemplists: React.Dispatch<React.SetStateAction<Templist[]>>,
  templistCards: Templist[],
) {
  const initializeTemplists = useCallback(() => {
    try {
      const storedData = localStorage.getItem("Templists");
      let initialTemplists: Templist[] = [];

      // Try to parse the stored data
      // Check if it's the expected format
      // Warn if data exists but isn't in the expected format
      // Error if data is corrupt or some shit, treat as empty
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);

          if (parsedData && Array.isArray(parsedData.templists)) {
            initialTemplists = parsedData.templists;
            console.log(
              `Successfully loaded ${initialTemplists.length} templists from localStorage.`,
            );
          } else {
            console.warn(
              "LocalStorage data found but is not in the expected { templists: [...] } format. Initializing with empty array.",
            );
          }
        } catch (parseError) {
          console.error(
            "Failed to parse Templists from localStorage:",
            parseError,
          );
        }
      } else {
        console.log(
          "No Templists found in localStorage. Initializing with empty array.",
        );
      }

      dispatch({ type: "SET_INITIAL_STATE", templists: initialTemplists });

      // Also update the saved state
      setSavedTemplists(initialTemplists);
    } catch (localStorageError) {
      console.error("Error accessing localStorage:", localStorageError);
      // Fallback to empty state
      dispatch({ type: "SET_INITIAL_STATE", templists: [] });
      setSavedTemplists([]);
    }
  }, [dispatch, setSavedTemplists]); // Dependencies are correct

  const handleSave = useCallback(
    (ulid: string, updatedItems: TemplistItem[]) => {
      try {
        const currentTemplistInState = templistCards.find(
          (t) => t.ulid === ulid,
        );

        if (!currentTemplistInState) {
          // This should theoretically not happen if the UI is showing the card
          console.warn(`Attempted to save non-existent templist ULID: ${ulid}`);
          toast.error(`Could not save: Templist not found in state.`);
          return;
        }

        const storedData = localStorage.getItem("Templists");
        const existingData = storedData
          ? (JSON.parse(storedData) as { templists: Templist[] })
          : { templists: [] };

        const existingTemplistsArray = Array.isArray(existingData.templists)
          ? existingData.templists
          : [];

        const templistIndex = existingTemplistsArray.findIndex(
          (t) => t.ulid === ulid,
        );

        let updatedTemplistsArray: Templist[];

        if (templistIndex > -1) {
          // If the templist is found in localStorage, update its items.
          // The title was handled by handleTitleChange previously.
          updatedTemplistsArray = existingTemplistsArray.map((t, index) =>
            index === templistIndex ? { ...t, items: updatedItems } : t,
          );
          console.log(
            `Updating existing templist (ULID: ${ulid}) items in localStorage.`,
          );
        } else {
          // If the templist is NOT found in localStorage (it's a new one),
          // add the *entire* object from the current state.
          updatedTemplistsArray = [
            ...existingTemplistsArray,
            currentTemplistInState,
          ];
          console.log(
            `Adding new templist (ULID: ${ulid}) to localStorage using state object.`,
          );
        }

        // Save the modified array back to localStorage
        localStorage.setItem(
          "Templists",
          JSON.stringify({ templists: updatedTemplistsArray }),
        );

        // Dispatch action to update the working state (templistCards).
        // This might seem redundant if the items were already correct,
        // but it confirms state matches what was persisted.
        dispatch({
          type: "UPDATE_ITEMS",
          ulid,
          newItems: updatedItems,
        });

        // Explicitly update the saved state to reflect the new/updated lists in storage
        setSavedTemplists(updatedTemplistsArray);

        toast.success(`Templist "${currentTemplistInState.title}" saved!`);
      } catch (error) {
        toast.error(`Error saving templists: ${error}`);
        console.error("Error saving templists:", error);
      }
    },
    // Add templistCards to the dependency array
    [dispatch, setSavedTemplists, templistCards],
  );

  // handleAddTemplist only adds to the working state, NOT directly to localStorage
  // It should NOT update the savedTemplists state here.
  const handleAddTemplist = useCallback(() => {
    const newId = ulid();
    const newTemplist: Templist = {
      ulid: newId,
      title: `Templist ${newId.slice(-5)}`,
      items: [],
    };
    dispatch({ type: "ADD_TEMPLIST", newTemplist });
  }, [dispatch]);

  const handleTitleChange = useCallback(
    (ulid: string, newTitle: string) => {
      let oldTitle: string = "";
      try {
        // ALWAYS dispatch action to update the working state (templistCards).
        dispatch({
          type: "UPDATE_TITLE",
          ulid,
          newTitle,
        });

        // Now, handle persistence to localStorage ONLY if the item is already saved.
        const storedData = localStorage.getItem("Templists");
        const existingData = storedData
          ? (JSON.parse(storedData) as { templists: Templist[] })
          : { templists: [] };

        const existingTemplistsArray = Array.isArray(existingData.templists)
          ? existingData.templists
          : [];

        const templistIndex = existingTemplistsArray.findIndex(
          (t) => t.ulid === ulid,
        );

        if (templistIndex > -1) {
          oldTitle = existingTemplistsArray[templistIndex].title;
          const updatedTemplistsArray = existingTemplistsArray.map(
            (t, index) =>
              index === templistIndex ? { ...t, title: newTitle } : t,
          );

          localStorage.setItem(
            "Templists",
            JSON.stringify({ templists: updatedTemplistsArray }),
          );

          setSavedTemplists(updatedTemplistsArray);
        } else {
          console.log(
            `Templist with ULID ${ulid} not found in localStorage. Title updated only in working state.`,
          );
        }

        toast.success(`Templist "${oldTitle}" title updated to "${newTitle}"!`);
      } catch (error) {
        toast.error(`Error updating templist title: ${error}`);
        console.error("Error updating templist title:", error);
      }
    },
    [dispatch, setSavedTemplists],
  );

  const handleDelete = useCallback(
    (ulid: string) => {
      dispatch({ type: "REMOVE_TEMPLIST", ulid });

      try {
        const storedData = localStorage.getItem("Templists");
        let updatedTemplists: Templist[] = [];
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData) as {
              templists: Templist[];
            };
            updatedTemplists = (parsedData.templists || []).filter(
              (t) => t.ulid !== ulid,
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

        // Explicitly update the saved state after deleting from localStorage
        setSavedTemplists(updatedTemplists); // Update the saved state

        toast.success(`Templist (ULID: ${ulid}) successfully deleted!`);
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
    handleTitleChange,
  };
}
