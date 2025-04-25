import { Templist } from "@/types/templist";
import { ActionTypes } from "@/types/actions";

export function TemplistReducer(
  state: Templist[],
  action: ActionTypes,
): Templist[] {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      // Ensure templists is an array before sorting
      return Array.isArray(action.templists)
        ? [...action.templists].sort((a, b) =>
            a.templistULID.localeCompare(b.templistULID),
          )
        : state; // Return current state if initial data is invalid

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
      // The localStorage removal logic has been moved to the handler.
      // This case now only updates the working state.
      const templistToRemove = state.find(
        (t) => t.templistULID === action.templistULID,
      );
      if (!templistToRemove) {
        console.warn(
          `Templist with ID ${action.templistULID} not found for removal in reducer.`,
        );
        // Do not throw error in reducer, just return current state
        return state;
      }
      return state.filter((t) => t.templistULID !== action.templistULID);
    default:
      throw Error("Unknown action.");
  }
}
