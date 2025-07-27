import { useState, useCallback } from "react";
import { TemplistItem } from "@/types/templist";

interface UseEditItemStateProps {
  onSaveEdit: (id: string, newText: string) => void; // Callback to save
}

interface UseEditItemStateResult {
  editingId: TemplistItem["itemId"] | null;
  editText: TemplistItem["text"];
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  isEditing: (id: string) => boolean;
  startEditing: (item: TemplistItem) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
}

export function useEditItemState({
  onSaveEdit,
}: UseEditItemStateProps): UseEditItemStateResult {
  const [editingId, setEditingId] = useState<TemplistItem["text"] | null>(null);
  const [editText, setEditText] = useState("");

  const isEditing = useCallback((id: TemplistItem["itemId"]) => editingId === id, [editingId]);

  const startEditing = useCallback((item: TemplistItem) => {
    setEditingId(item.itemId);
    setEditText(item.text);
  }, []);

  const saveEdit = useCallback(() => {
    const trimmedText = editText.trim();
    if (!editingId || trimmedText === "") return;

    onSaveEdit(editingId, trimmedText); // Call callback
    setEditingId(null);
    setEditText("");
    // Optional: toast success
  }, [editingId, editText, onSaveEdit]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditText("");
  }, []);

  return {
    editingId,
    editText,
    setEditText,
    isEditing,
    startEditing,
    saveEdit,
    cancelEdit,
  };
}
