import { useState, useEffect, useCallback } from "react";
import { TemplistItem } from "@/types/templist";
import getItemId from "@/lib/utils/templist/getItemId";

interface UseTemplistResult {
  items: TemplistItem[];
  lastUpdated: Date | null;
  addItemToList: (text: string) => void; // Accepts text, generates ID internally
  deleteItemFromList: (id: string) => void;
  toggleItemComplete: (id: string) => void;
  updateItemText: (id: string, newText: string) => void;
}

export function useTemplist(
  initialItems: TemplistItem[],
  ulid: string,
): UseTemplistResult {
  const [items, setItems] = useState<TemplistItem[]>(initialItems);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setItems(initialItems);
    // Reset timestamp when initial items change? Or maybe load from props/data?
    // For now, let's reset it. If you load a saved timestamp, set it here.
    // setLastUpdated(loadedTimestamp || null);
  }, [initialItems]);

  // Function to update the timestamp
  const touchTimestamp = useCallback(() => {
    setLastUpdated(new Date());
  }, []);

  const addItemToList = useCallback(
    (text: string) => {
      const newItem: TemplistItem = {
        itemId: getItemId(ulid, items),
        text: text.trim(),
        completed: false,
      };
      setItems((prev) => [...prev, newItem]);
      touchTimestamp();
    },
    [ulid, items, touchTimestamp],
  ); // Depends on current items state for ID generation

  const deleteItemFromList = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.itemId !== id));
      touchTimestamp();
    },
    [touchTimestamp],
  );

  const toggleItemComplete = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.itemId === id ? { ...item, completed: !item.completed } : item,
        ),
      );
      touchTimestamp();
    },
    [touchTimestamp],
  );

  const updateItemText = useCallback(
    (id: string, newText: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.itemId === id ? { ...item, text: newText.trim() } : item,
        ),
      );
      touchTimestamp();
    },
    [touchTimestamp],
  );

  return {
    items,
    addItemToList,
    lastUpdated,
    deleteItemFromList,
    toggleItemComplete,
    updateItemText,
  };
}
