"use client";

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

import { useTemplist } from "@/hooks/templist/useTemplist";
import { useAddItem } from "@/hooks/templist/useAddItem";
import { useEditItemState } from "@/hooks/templist/useEditItemState";
import formatTimestamp from "@/lib/utils/dateUtils";

import { TemplistItem } from "@/types/templist";

interface TemplistCardProps {
  ulid: string;
  items: TemplistItem[];
  onSave: (updatedItems: TemplistItem[]) => void;
  onDelete: () => void;
}

export const TemplistCard: React.FC<TemplistCardProps> = ({
  ulid,
  items: initialItems,
  onSave,
  onDelete,
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

  // --- Save Button Handler ---
  const handleSave = () => {
    onSave(localItems); // Use the current items from useTemplist
  };

  const handleDelete = () => {
    onDelete();
  };

  const displayTimestamp = formatTimestamp(lastUpdated);

  return (
    <Card className="mx-auto mt-4 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <div className="flex justify-between">
            <div className="flex-1" id={ulid}>
              Templist
            </div>
            {localItems.length > 0 ? (
              <AlertWithDialog
                handleOnClick={handleDelete}
                ulid={ulid}
              >
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
