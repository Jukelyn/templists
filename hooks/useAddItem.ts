import { useState, useCallback } from "react";

interface useAddItemProps {
  onAddItem: (text: string) => void; // Callback to actually add the item
}

interface useAddItemResult {
  newItemText: string;
  setNewItemText: React.Dispatch<React.SetStateAction<string>>;
  submitNewItem: () => void;
}

export function useAddItem({ onAddItem }: useAddItemProps): useAddItemResult {
  const [newItemText, setNewItemText] = useState("");

  const submitNewItem = useCallback(() => {
    const trimmedText = newItemText.trim();
    if (trimmedText === "") return;

    onAddItem(trimmedText);
    setNewItemText("");
  }, [newItemText, onAddItem]);

  return { newItemText, setNewItemText, submitNewItem };
}
