"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Templist, TemplistItem } from "@/types/templist";
import { ActionTypes } from "@/types/actions";
import { toast } from "sonner";

// Extend the context type to include layout and toggleLayout.
export type LayoutType = "list" | "grid" | "masonry";

interface TemplistContextType {
  templistCards: Templist[];
  savedTemplists: Templist[];
  dispatch: React.Dispatch<ActionTypes>;
  setSavedTemplists: React.Dispatch<React.SetStateAction<Templist[]>>;
  handleSave: (ulid: string, items: TemplistItem[]) => void;
  handleAddTemplist: () => void;
  handleDelete: (ulid: string) => void;
  handleTitleChange: (ulid: string, newTitle: string) => void;
  layout: LayoutType;
  changeLayout: (newLayout: LayoutType) => void;
}

const TemplistContext = createContext<TemplistContextType | null>(null);

export const useTemplistContext = () => {
  const context = useContext(TemplistContext);
  if (context === null) {
    throw new Error(
      "useTemplistContext must be used within a TemplistProvider",
    );
  }
  return context;
};

interface TemplistProviderProps {
  children: ReactNode;
  value: Omit<TemplistContextType, "layout" | "changeLayout">;
}

export const TemplistProvider: React.FC<TemplistProviderProps> = ({
  children,
  value,
}) => {
  // Initialize layout state locally.
  const [layout, setLayout] = React.useState<LayoutType>("list");

  React.useEffect(() => {
    const storedLayout = localStorage.getItem("templistLayout");
    if (storedLayout) {
      if (storedLayout === "masonry") {
        if (value.savedTemplists.length <= 3) {
          setLayout("grid");
          return;
        }
      }
      setLayout(storedLayout as LayoutType);
    }
  }, [value.savedTemplists.length]);

  // Function to switch layouts.
  const changeLayout = (newLayout: LayoutType) => {
    if (newLayout !== layout) {
      setLayout(newLayout);
      localStorage.setItem("templistLayout", newLayout);
      toast.success(`Layout changed to: ${newLayout}`);
    }
  };

  // Merge the passed-in value with the new layout state and function.
  const extendedValue: TemplistContextType = {
    ...value,
    layout,
    changeLayout,
  };

  React.useEffect(() => {
    const handleStorageChange = () => {
      console.log("Storage change detected from another tab");
      const stored = localStorage.getItem("Templists");
      let persistedTemplists: Templist[] = [];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          persistedTemplists = parsed.templists || [];
        } catch (err) {
          console.error(
            "Failed to parse Templists from localStorage in storage event",
            err,
          );
        }
      }

      // Update both the working state and the saved state
      value.dispatch({
        type: "SET_INITIAL_STATE",
        templists: persistedTemplists,
      });
      value.setSavedTemplists(persistedTemplists);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [value, value.dispatch, value.setSavedTemplists]);

  return (
    <TemplistContext.Provider value={extendedValue}>
      {children}
    </TemplistContext.Provider>
  );
};
