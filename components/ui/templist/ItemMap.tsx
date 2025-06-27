import { Trash2, Pencil, Check, X, Clipboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { TemplistItem } from "@/types/templist";

interface TemplistItemMapProps {
  item: TemplistItem;
  isEditing: (id: string) => boolean;
  editText: string;
  setEditText: (value: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  startEditing: (item: TemplistItem) => void;
  deleteItemFromList: (id: string) => void;
  toggleItemComplete: (id: string) => void;
}

const TemplistItemMap: React.FC<TemplistItemMapProps> = ({
  item,
  isEditing,
  editText,
  setEditText,
  saveEdit,
  cancelEdit,
  startEditing,
  deleteItemFromList,
  toggleItemComplete,
}) => {
  async function copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);

      let shownExcerpt = item.text.split(" ").slice(0, 3).join(" ");

      if (shownExcerpt.length < item.text.length) {
        shownExcerpt = shownExcerpt + "...";
      }

    } catch (err) {
      console.error("Failed to copy text from item. ", err);
    }
  }

  return (
    <div className="flex items-center rounded-md border bg-black p-3 shadow-sm">
      {isEditing(item.itemId) ? (
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
              onCheckedChange={() => toggleItemComplete(item.itemId)}
              className="mr-3"
            />
            <span
              className={`flex-1 ${item.completed ? "text-muted-foreground line-through" : ""}`}
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
              onClick={() => deleteItemFromList(item.itemId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplistItemMap;
