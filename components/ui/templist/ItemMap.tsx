import { useState } from "react";
import { Trash2, Pencil, Check, X, Clipboard, StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TemplistItemNotesDialog } from "@/components/ui/templist/TemplistItemNotesDialog";

import { TemplistItem } from "@/types/templist";
import { toast } from "sonner";

interface TemplistItemMapProps {
  item: TemplistItem;
  isEditing: (id: TemplistItem["itemId"]) => boolean;
  editText: TemplistItem["text"];
  setEditText: (value: TemplistItem["text"]) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  startEditing: (item: TemplistItem) => void;
  deleteItemFromList: (id: TemplistItem["itemId"]) => void;
  toggleItemComplete: (id: TemplistItem["itemId"]) => void;
  updateItemNotes: (
    id: TemplistItem["itemId"],
    notes: TemplistItem["notes"],
  ) => void;
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
  updateItemNotes,
}) => {
  const [showNotesDialog, setShowNotesDialog] = useState(false); // State for dialog visibility

  async function copyToClipboard(text: TemplistItem["text"]): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);

      let shownExcerpt = item.text.split(" ").slice(0, 3).join(" ");

      if (shownExcerpt.length < item.text.length) {
        shownExcerpt = shownExcerpt + "...";
      }

      toast.success(`Item text "${shownExcerpt}" copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy text from item. ", err);
    }
  }

  const handleSaveNotes = (notes: TemplistItem["notes"]) => {
    updateItemNotes(item.itemId, notes);
  };

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
            maxLength={40}
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
              className={`flex-1 [overflow-wrap:anywhere] whitespace-normal ${item.completed ? "text-muted-foreground line-through" : ""}`}
            >
              {item.text}
            </span>
          </div>
          <div className="flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copyToClipboard(item.text)}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
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
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowNotesDialog(true)}
            >
              <StickyNote className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      <TemplistItemNotesDialog
        isOpen={showNotesDialog}
        onClose={() => setShowNotesDialog(false)}
        initialNotes={item.notes || ""}
        onSaveNotes={handleSaveNotes}
        itemText={item.text}
      />
    </div>
  );
};

export default TemplistItemMap;
