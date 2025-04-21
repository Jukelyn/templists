"use client";

import { useState } from "react";
import { TemplistCard } from "@/components/TemplistCard";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function ChecklistApp() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "1", text: "Create a checklist app", completed: false },
    { id: "2", text: "Add edit functionality", completed: false },
    { id: "3", text: "Make it responsive", completed: false },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <TemplistCard templistId={1} items={items} setItems={setItems} />
    </div>
  );
}
