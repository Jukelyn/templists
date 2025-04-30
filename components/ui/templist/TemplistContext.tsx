"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Templist, TemplistItem } from "@/types/templist";
import { ActionTypes } from "@/types/actions";

export type LayoutType = "list" | "grid";

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
  toggleLayout: () => void;
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
  value: Omit<TemplistContextType, "layout" | "toggleLayout">;
}

export const TemplistProvider: React.FC<TemplistProviderProps> = ({
  children,
  value,
}) => {
  // Initialize layout state from localStorage or default to "list".
  const [layout, setLayout] = React.useState<LayoutType>("list");

  React.useEffect(() => {
    const storedLayout = localStorage.getItem("templistLayout");
    if (storedLayout) {
      setLayout(storedLayout as LayoutType);
    }
  }, []);

  // Toggle function to switch layouts and save to localStorage.
  const toggleLayout = () => {
    setLayout((prev) => {
      const newLayout = prev === "list" ? "grid" : "list";
      localStorage.setItem("templistLayout", newLayout);
      return newLayout;
    });
  };

  // Merge the passed-in value with the new layout state and function.
  const extendedValue: TemplistContextType = {
    ...value,
    layout,
    toggleLayout,
  };

  React.useEffect(() => {
    localStorage.setItem("templistLayout", layout);
  }, [layout]);

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
