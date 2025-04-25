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
import { Download } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Use the context hook to get the saved templists state
  const { savedTemplists } = useTemplistContext();

  return (
    <Sidebar side="right" {...props} className="w-84">
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Saved Templists</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Use savedTemplists from the context */}
              {savedTemplists.map((item) => (
                <SidebarMenuItem key={item.templistULID}>
                  <SidebarMenuButton asChild>
                    <button>
                      <span>ULID: {item.templistULID}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
