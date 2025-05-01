"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/search-bar/dialog";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

export function ExportDialog({
  open,
  onOpenChange,
  message,
}: ExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* No use trigger, want use state */}
      <DialogContent
        className="sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>All Templists</DialogTitle>
          <DialogDescription asChild>
            <ScrollArea className="max-h-64 overflow-y-auto rounded border border-gray-300 p-4 whitespace-pre-wrap text-gray-300">
              <code>{message}</code>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="link"
              defaultValue={message.replace(/\s+/g, "")}
              readOnly
              className="w-full"
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={() => {
              const linkInput = document.getElementById(
                "link",
              ) as HTMLInputElement;
              if (linkInput) {
                navigator.clipboard.writeText(linkInput.value);
              }
            }}
          >
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
