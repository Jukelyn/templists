export interface Templist {
  templistId: number;
  items: TemplistItem[];
}

export interface TemplistItem {
  itemId: string;
  text: string;
  completed: boolean;
}
