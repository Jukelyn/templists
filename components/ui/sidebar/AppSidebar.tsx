"use client";

import React from "react";
import { useTemplistContext } from "@/components/ui/templist/TemplistContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar/sidebar";

import { toast } from "sonner";
import Link from "next/link";
import { Download, Trash, Grid2x2, Rows2 } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Use the context hook to get the saved templists state
  const { savedTemplists, setSavedTemplists } = useTemplistContext();

  function handleClear() {
    setSavedTemplists([]);
    localStorage.removeItem("Templists");
    toast.info("Saved templists cleared!");
  }

  const titleCount: Record<string, number> = {};

  return (
    <Sidebar collapsible={"offcanvas"} side="right" {...props} className="w-84">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Options</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button>
                    <Download className="h-4 w-4" />
                    <span>Export All Templists</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button>
                    <Download className="h-4 w-4" />
                    <span>Export Saved Templists</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={handleClear}>
                    <Trash className="h-4 w-4" />
                    <span>Clear All Saved Templists</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button>
                    {/* on click, toggle icon and shown text */}
                    {/* Change which of these show based on current layout */}
                    <Rows2 className="h-4 w-4" />
                    {/* <span>Switch to row layout</span> */}
                    <Grid2x2 className="h-4 w-4" />
                    <span>Switch to grid layout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Saved Templists</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Use savedTemplists from the context */}
              {savedTemplists.map((item) => {
                let displayTitle = "";

                // If there is no title, use the last 6 characters of the ULID
                if (item.title === "") {
                  displayTitle = item.ulid.slice(-6);
                } else {
                  // Count occurrences for non-empty titles
                  if (titleCount[item.title]) {
                    titleCount[item.title]++;
                    displayTitle = `${item.title} (${titleCount[item.title]})`;
                  } else {
                    titleCount[item.title] = 1;
                    displayTitle = item.title;
                  }
                }

                return (
                  <SidebarMenuItem key={item.ulid}>
                    <SidebarMenuButton asChild>
                      <Link href={`#${item.ulid}`}>
                        <span>{displayTitle}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
