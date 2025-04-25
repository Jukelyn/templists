"use client";

import React, { useEffect, useReducer, useRef, useState } from "react";
import { AppSidebar } from "@/components/ui/sidebar/AppSidebar";
import { TemplistProvider } from "@/components/ui/templist/TemplistContext";
import { TemplistReducer } from "@/lib/utils/TemplistReducer";
import { useTemplistHandlers } from "@/lib/utils/templist/TemplistHandlers";
import { Templist } from "@/types/templist";

interface TemplistLayoutClientProps {
  children: React.ReactNode;
}

export default function TemplistLayoutClient({
  children,
}: TemplistLayoutClientProps) {
  // State for the current working set (in the main view)
  const [templistCards, dispatch] = useReducer(TemplistReducer, []);
  // State for the list of templists currently saved in localStorage (for the sidebar)
  const [savedTemplists, setSavedTemplists] = useState<Templist[]>([]);

  const isDataLoaded = useRef(false);

  // Pass both dispatch and setSavedTemplists to the handlers hook
  const { handleSave, handleAddTemplist, handleDelete, initializeTemplists } =
    useTemplistHandlers(dispatch, setSavedTemplists);

  // Initialize state from localStorage on the initial client render
  useEffect(() => {
    if (!isDataLoaded.current) {
      initializeTemplists();
      isDataLoaded.current = true;
    }
  }, [initializeTemplists]);

  // The value provided to the context
  const contextValue = {
    templistCards,
    savedTemplists,
    dispatch,
    setSavedTemplists,
    handleSave,
    handleAddTemplist,
    handleDelete,
  };

  return (
    <TemplistProvider value={contextValue}>
      <div className="flex min-h-screen w-full flex-row-reverse">
        <AppSidebar side="right" />
        <div className="relative flex-1">{children}</div>
      </div>
    </TemplistProvider>
  );
}
