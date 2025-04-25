import { Templist, TemplistItem } from "@/types/templist";

const getLastItemIdForTemplist = (templistULID: string): number => {
  const lists = JSON.parse(localStorage.getItem("Templists") || "{}") as {
    templists: Templist[];
  };
  const templist = lists.templists.find(
    (list) => list.templistULID === templistULID,
  );

  if (!templist || !templist.items || templist.items.length === 0) {
    return 0;
  }

  return Math.max(...templist.items.map((t) => parseInt(t.itemId, 10) + 1));
};

const getItemId = (
  templistULID: string,
  initialItems: TemplistItem[],
): string => {
  const currentSavedMaxItemId = getLastItemIdForTemplist(templistULID);

  if (initialItems && initialItems.length > 0) {
    const initialMaxItemId = Math.max(
      ...initialItems.map((t) => parseInt(t.itemId, 10) + 1),
    );

    return Math.max(currentSavedMaxItemId, initialMaxItemId).toString();
  }

  return currentSavedMaxItemId.toString();
};

export default getItemId;
