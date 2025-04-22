import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TemplistItem {
  itemId: string;
  text: string;
  completed: boolean;
}

interface TemplistCardProps {
  templistId: number;
  items: TemplistItem[];
  setItems: (items: TemplistItem[]) => void;
}

export const TemplistCard: React.FC<TemplistCardProps> = ({
  templistId,
  items,
  setItems,
}) => {
  const [newItemText, setNewItemText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const addItem = () => {
    if (newItemText.trim() === "") return;

    const newItem: TemplistItem = {
      itemId: Date.now().toString(),
      text: newItemText,
      completed: false,
    };

    setItems([...items, newItem]);
    setNewItemText("");
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.itemId !== id));
  };

  const toggleComplete = (id: string) => {
    setItems(
      items.map((item) =>
        item.itemId === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const startEditing = (item: TemplistItem) => {
    setEditingId(item.itemId);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (editText.trim() === "") return;

    setItems(
      items.map((item) =>
        item.itemId === editingId ? { ...item, text: editText } : item,
      ),
    );

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
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
          {items.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              Your templist is empty. Add some items!
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.itemId}
                className="flex items-center rounded-md border bg-black p-3 shadow-sm"
              >
                {editingId === item.itemId ? (
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
      </CardContent>
    </Card>
  );
};
