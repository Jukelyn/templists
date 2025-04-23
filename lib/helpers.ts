import data from "@/data/templists.json";
import { TemplistItem } from "@/types/templist";

const getLastItemIdForTemplist = (templistId: number): number => {
  const templist = data.templists.find(
    (list) => list.templistId === templistId,
  );

  if (!templist || !templist.items || templist.items.length === 0) {
    return 0;
  }

  return Math.max(...templist.items.map((t) => parseInt(t.itemId, 10) + 1));
};

export const getItemId = (
  templistId: number,
  initialItems: TemplistItem[],
): string => {
  const currentSavedMaxItemId = getLastItemIdForTemplist(templistId);

  if (initialItems && initialItems.length > 0) {
    const initialMaxItemId = Math.max(
      ...initialItems.map((t) => parseInt(t.itemId, 10) + 1),
    );

    return Math.max(currentSavedMaxItemId, initialMaxItemId).toString();
  }

  return currentSavedMaxItemId.toString();
};
