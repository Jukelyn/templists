import { Templist } from "@/types/templist";
import { ActionTypes } from "@/types/actions";

export function TemplistReducer(
  state: Templist[],
  action: ActionTypes,
): Templist[] {
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
