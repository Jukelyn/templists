"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function ChecklistApp() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "1", text: "Create a checklist app", completed: true },
    { id: "2", text: "Add edit functionality", completed: false },
    { id: "3", text: "Make it responsive", completed: false },
  ]);
  const [newItemText, setNewItemText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const addItem = () => {
    if (newItemText.trim() === "") return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
    };

    setItems([...items, newItem]);
    setNewItemText("");
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleComplete = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const startEditing = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (editText.trim() === "") return;

    setItems(
      items.map((item) =>
        item.id === editingId ? { ...item, text: editText } : item
      )
    );

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            My Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Add new item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              className="flex-1"
            />
            <Button onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Your checklist is empty. Add some items!
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-3 border rounded-md bg-white shadow-sm"
                >
                  {editingId === item.id ? (
                    <div className="flex items-center w-full space-x-2">
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
                      <div className="flex items-center flex-1">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleComplete(item.id)}
                          className="mr-3"
                        />
                        <span
                          className={`flex-1 ${
                            item.completed
                              ? "line-through text-muted-foreground"
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
                          onClick={() => deleteItem(item.id)}
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
    </div>
  );
}
