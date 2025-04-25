export interface Templist {
  templistULID: string;
  items: TemplistItem[];
}

export interface TemplistItem {
  itemId: string;
  text: string;
  completed: boolean;
}
