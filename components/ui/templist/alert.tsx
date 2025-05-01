"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/templist/alert-dialog";

interface Props {
  handleOnClick: () => void;
  message?: string;
  ulid?: string;
  children?: React.ReactNode;
}

const AlertWithDialog = React.forwardRef<
  HTMLButtonElement,
  Props & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function AlertWithDialog(
  { handleOnClick, message, ulid, children, ...props },
  ref,
) {
  return (
    <AlertDialog>
      <AlertDialogTrigger ref={ref} {...props}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {message
              ? message
              : `This action cannot be undone. This will permanently delete this templist (ULID: ${ulid}).`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnClick}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
AlertWithDialog.displayName = "AlertWithDialog";

export default AlertWithDialog;
