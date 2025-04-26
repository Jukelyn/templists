"use client";

import { useState } from "react";

import { Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/templist/card";
import ConditionalTimestamp from "@/components/ui/templist/ConditionalTimestamp";
import TemplistItemMap from "@/components/ui/templist/ItemMap";
import AlertWithDialog from "@/components/ui/templist/alert";
import { TitleInput } from "@/components/ui/templist/TitleInput";

import { useTemplist } from "@/hooks/templist/useTemplist";
import { useAddItem } from "@/hooks/templist/useAddItem";
import { useEditItemState } from "@/hooks/templist/useEditItemState";
import formatTimestamp from "@/lib/utils/dateUtils";

import { TemplistItem } from "@/types/templist";

interface TemplistCardProps {
  ulid: string;
  title: string;
  items: TemplistItem[];
  onSave: (updatedItems: TemplistItem[]) => void;
  onDelete: () => void;
  onTitleChange: (newTitle: string) => void;
}

export const TemplistCard: React.FC<TemplistCardProps> = ({
  ulid,
  title,
  items: initialItems,
  onSave,
  onDelete,
  onTitleChange,
}) => {
  const {
    items: localItems, // Renamed from 'items' to avoid conflict
    lastUpdated,
    addItemToList,
    deleteItemFromList,
    toggleItemComplete,
    updateItemText,
  } = useTemplist(initialItems, ulid || "");

  const { newItemText, setNewItemText, submitNewItem } = useAddItem({
    onAddItem: addItemToList,
  });

  const {
    editText,
    setEditText,
    isEditing,
    startEditing,
    saveEdit,
    cancelEdit,
  } = useEditItemState({
    onSaveEdit: updateItemText,
  });

  const handleSave = () => {
    onSave(localItems); // Use the current items from useTemplist
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  const displayTimestamp = formatTimestamp(lastUpdated);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <Card className="mx-auto mt-4 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <div className="flex items-center justify-between">
            <div className="flex-1" id={ulid}>
              {isEditingTitle ? (
                <TitleInput
                  type="text"
                  value={title}
                  onChange={handleTitleInputChange}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    if (e.key === "Escape") setIsEditingTitle(false);
                  }}
                  className="text-2xl font-bold"
                />
              ) : (
                <span
                  className="cursor-text text-2xl font-bold"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {title || (
                    <span className="text-muted-foreground italic">
                      Click to name
                    </span>
                  )}
                </span>
              )}
            </div>
            {localItems.length > 0 ? (
              <AlertWithDialog handleOnClick={handleDelete} ulid={ulid}>
                <X className="h-4 w-4" />
              </AlertWithDialog>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex space-x-2">
          <Input
            placeholder="Add new item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitNewItem()}
            className="flex-1"
          />
          <Button onClick={submitNewItem}>
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
              <TemplistItemMap
                key={item.itemId}
                item={item}
                isEditing={isEditing}
                editText={editText}
                setEditText={setEditText}
                saveEdit={saveEdit}
                cancelEdit={cancelEdit}
                startEditing={startEditing}
                deleteItemFromList={deleteItemFromList}
                toggleItemComplete={toggleItemComplete}
              />
            ))
          )}
        </div>
        <div className="mt-4 flex items-center justify-between p-2">
          <ConditionalTimestamp timestamp={displayTimestamp} />
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save this Templist
          </Button>
        </div>
        <div className="text-muted-foreground mt-4 text-center text-xs">
          List ULID: {ulid}
        </div>
      </CardContent>
    </Card>
  );
};
