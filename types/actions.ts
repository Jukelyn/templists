import { Templist, TemplistItem } from "./templist";

export type ActionTypes =
  | { type: "SET_INITIAL_STATE"; templists: Templist[] }
  | { type: "UPDATE_ITEMS"; templistId: number; newItems: TemplistItem[] }
  | { type: "ADD_TEMPLIST"; newTemplist: Templist }
  | { type: "REMOVE_TEMPLIST"; templistId: number };
