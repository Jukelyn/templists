export interface Templist {
  ulid: string;
  items: TemplistItem[];
}

export interface TemplistItem {
  itemId: string;
  text: string;
  completed: boolean;
}
