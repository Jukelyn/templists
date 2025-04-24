import { Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConditionalTimestamp from "@/components/ConditionalTimestamp";
import TemplistItemMap from "@/components/ItemMap";

import { useTaskList } from "@/hooks/useTaskList";
import { useAddItem } from "@/hooks/useAddItem";
import { useEditItemState } from "@/hooks/useEditItemState";
import formatTimestamp from "@/lib/utils/dateUtils";

import { TemplistItem } from "@/types/templist";

interface TemplistCardProps {
  templistId: number;
  items: TemplistItem[];
  onSave: (updatedItems: TemplistItem[]) => void;
  onDelete: () => void;
}

export const TemplistCard: React.FC<TemplistCardProps> = ({
  templistId,
  items: initialItems,
  onSave,
  onDelete,
}) => {
  // Instantiate the core list hook
  const {
    items: localItems, // Renamed from 'items' to avoid conflict
    lastUpdated,
    addItemToList,
    deleteItemFromList,
    toggleItemComplete,
    updateItemText,
  } = useTaskList(initialItems, templistId);

  // Instantiate the add form hook, passing the adder function from useTaskList
  const { newItemText, setNewItemText, submitNewItem } = useAddItem({
    onAddItem: addItemToList, // Wire the callback
  });

  // Instantiate the edit state hook, passing the update function from useTaskList
  const {
    editText,
    setEditText,
    isEditing, // Use this helper
    startEditing,
    saveEdit,
    cancelEdit,
  } = useEditItemState({
    onSaveEdit: updateItemText, // Wire the callback
  });

  // --- Save Button Handler ---
  const handleSave = () => {
    onSave(localItems); // Use the current items from useTaskList
  };

  const handleDelete = () => {
    onDelete();
  };

  const displayTimestamp = formatTimestamp(lastUpdated);

  return (
    <Card className="mx-auto mt-4 max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <div className="flex justify-between">
            <div className="flex-1">
              Templist {templistId > 1 ? `(${templistId})` : ""}
            </div>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex space-x-2">
          <Input
            placeholder="Add new item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitNewItem()} // Use submitNewItem
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
      </CardContent>
    </Card>
  );
};
