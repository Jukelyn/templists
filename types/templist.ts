export interface Templist {
  ulid: string;
  title: string;
  items: TemplistItem[];
}

export interface TemplistItem {
  itemId: string;
  text: string;
  notes: string;
  completed: boolean;
}
