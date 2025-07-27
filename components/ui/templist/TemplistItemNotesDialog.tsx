import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/search-bar/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TemplistItem } from "@/types/templist";

interface TemplistItemNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialNotes: TemplistItem["notes"];
  onSaveNotes: (notes: TemplistItem["notes"]) => void;
  itemText: TemplistItem["text"];
}

export const TemplistItemNotesDialog: React.FC<
  TemplistItemNotesDialogProps
> = ({ isOpen, onClose, initialNotes, onSaveNotes, itemText }) => {
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleSave = () => {
    onSaveNotes(notes);
    onClose();
  };

  const getTruncatedText = (text: TemplistItem["text"]): string => {
    let shownExcerpt = text.split(" ").slice(0, 3).join(" ");
    if (shownExcerpt.length < text.length) {
      shownExcerpt = shownExcerpt + "...";
    }
    return shownExcerpt;
  };

  const truncatedItemText = getTruncatedText(itemText);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notes for &quot;{truncatedItemText}&quot;</DialogTitle>
          <DialogDescription>
            Add or edit notes for this templist item.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="item-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="col-span-3 min-h-[100px] max-h-[200px]"
            placeholder="Type your notes here..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Notes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
