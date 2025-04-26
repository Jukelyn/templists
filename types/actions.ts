import { Templist, TemplistItem } from "./templist";

export type ActionTypes =
  | { type: "SET_INITIAL_STATE"; templists: Templist[] }
  | { type: "UPDATE_ITEMS"; ulid: string; newItems: TemplistItem[] }
  | { type: "ADD_TEMPLIST"; newTemplist: Templist }
  | { type: "REMOVE_TEMPLIST"; ulid: string }
  | { type: "UPDATE_TITLE"; ulid: string; newTitle: string };
