"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Templist, TemplistItem } from "@/types/templist";
import { ActionTypes } from "@/types/actions";

interface TemplistContextType {
  templistCards: Templist[];
  savedTemplists: Templist[];
  dispatch: React.Dispatch<ActionTypes>;
  setSavedTemplists: React.Dispatch<React.SetStateAction<Templist[]>>;
  handleSave: (ulid: string, items: TemplistItem[]) => void;
  handleAddTemplist: () => void;
  handleDelete: (ulid: string) => void;
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
  value: TemplistContextType;
}

export const TemplistProvider: React.FC<TemplistProviderProps> = ({
  children,
  value,
}) => {
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
    <TemplistContext.Provider value={value}>
      {children}
    </TemplistContext.Provider>
  );
};
