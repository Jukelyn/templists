import { Templist, TemplistItem } from "./templist";

export type ActionTypes =
  | { type: "SET_INITIAL_STATE"; templists: Templist[] }
  | { type: "UPDATE_ITEMS"; templistULID: string; newItems: TemplistItem[] }
  | { type: "ADD_TEMPLIST"; newTemplist: Templist }
  | { type: "REMOVE_TEMPLIST"; templistULID: string };
