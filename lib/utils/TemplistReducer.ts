import { Templist } from "@/types/templist";
import { ActionTypes } from "@/types/actions";

export function TemplistReducer(
  state: Templist[],
  action: ActionTypes,
): Templist[] {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return [...action.templists].sort((a, b) =>
        a.templistULID.localeCompare(b.templistULID),
      );

    case "UPDATE_ITEMS":
      return state.map((t) =>
        t.templistULID === action.templistULID
          ? { ...t, items: action.newItems }
          : t,
      );
    case "ADD_TEMPLIST":
      if (
        state.some((t) => t.templistULID === action.newTemplist.templistULID)
      ) {
        console.warn(
          `Templist with ID ${action.newTemplist.templistULID} already exists.`,
        );
        return state;
      }

      return [...state, action.newTemplist];
    case "REMOVE_TEMPLIST":
      const templistToRemove = state.find(
        (t) => t.templistULID === action.templistULID,
      );
      if (!templistToRemove) {
        console.warn(
          `Templist with ID ${action.templistULID} not found for removal.`,
        );

        throw Error(`Templist of id ${action.templistULID} not found.`);
      }
      const currentSavedLists = localStorage.getItem("Templists");
      if (currentSavedLists) {
        try {
          const parsedData = JSON.parse(currentSavedLists) as {
            templists: Templist[];
          };
          const updatedTemplists = parsedData.templists.filter(
            (t) => t.templistULID !== action.templistULID,
          );
          localStorage.setItem(
            "Templists",
            JSON.stringify({ templists: updatedTemplists }),
          );
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }

      return state.filter((t) => t.templistULID !== action.templistULID);
    default:
      throw Error("Unknown action.");
  }
}
