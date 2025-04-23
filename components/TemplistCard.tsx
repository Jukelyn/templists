import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplistItem } from "@/types/templist";
import data from "@/data/templists.json";
import { toast } from "sonner";
interface TemplistCardProps {
  templistId: number;
  items: TemplistItem[];
  onSave: (updatedItems: TemplistItem[]) => void;
}

const getItemId = (
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

const getLastItemIdForTemplist = (templistId: number): number => {
  const templist = data.templists.find(
    (list) => list.templistId === templistId,
  );

  if (!templist || !templist.items || templist.items.length === 0) {
    return 0;
  }

  return Math.max(...templist.items.map((t) => parseInt(t.itemId, 10) + 1));
};

export const TemplistCard: React.FC<TemplistCardProps> = ({
  templistId,
  items: initialItems,
  onSave,
}) => {
  const [localItems, setLocalItems] = useState<TemplistItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    setLocalItems(initialItems);
  }, [initialItems]);

  const addItem = () => {
    if (newItemText.trim() === "") return;

    if (newItemText.trim() === "") return;

    const newItem: TemplistItem = {
      itemId: getItemId(templistId, localItems),
      text: newItemText,
      completed: false,
    };
    setLocalItems((prevItems) => [...prevItems, newItem]);
    toast.success(`Item added to templist ${templistId}.`);
  };

  const deleteItem = (id: string) => {
    setLocalItems((prevItems) =>
      prevItems.filter((item) => item.itemId !== id),
    );
  };

  const toggleComplete = (id: string) => {
    setLocalItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const startEditing = (item: TemplistItem) => {
    setEditingId(item.itemId);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (!editingId || editText.trim() === "") return;
    setLocalItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === editingId ? { ...item, text: editText } : item,
      ),
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    // Optional: Reset editText if needed, or just rely on startEditing setting it next time
  };

  // --- Save Button Handler ---
  const handleSave = () => {
    // Call the onSave prop passed from the parent,
    // giving it the current state of items in this card.
    onSave(localItems);
  };

  return (
    <Card className="mx-auto mt-4 max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          The Templist {templistId > 1 ? `(${templistId})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex space-x-2">
          <Input
            placeholder="Add new item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            className="flex-1"
          />
          <Button onClick={addItem}>
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {localItems.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              Your templist is empty. Add some items!
            </p>
          ) : (
            localItems.map((item) => (
              <div
                key={item.itemId}
                className="flex items-center rounded-md border bg-black p-3 shadow-sm"
              >
                {editingId === item.itemId ? (
                  // --- Editing View ---
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={saveEdit}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  // --- Standard View ---
                  <>
                    <div className="flex flex-1 items-center">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleComplete(item.itemId)}
                        className="mr-3"
                      />
                      <span
                        className={`flex-1 ${
                          item.completed
                            ? "text-muted-foreground line-through"
                            : ""
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteItem(item.itemId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        <Button onClick={handleSave} className="float-right mt-4 p-2">
          <Save className="h-4 w-4" />
          Save this Templist
        </Button>
      </CardContent>
    </Card>
  );
};
