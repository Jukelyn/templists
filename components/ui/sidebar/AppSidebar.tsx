// AppSidebar.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useTemplistContext } from "@/components/ui/templist/TemplistContext";
import AlertWithDialog from "@/components/ui/templist/alert";
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
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar/sidebar";
import { toast } from "sonner";
import Link from "next/link";
import {
  X,
  Download,
  Save,
  SaveOff,
  Trash,
  LayoutPanelLeft,
  Rows2,
  Grid2x2,
} from "lucide-react";
import Image from "next/image";

import { ExportDialog } from "@/components/ui/sidebar/ExportModal";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpen } = useSidebar();

  const handleClickTemplist = useCallback(() => {
    setTimeout(() => {
      const offset = 40;
      window.scrollBy({ top: -offset, behavior: "smooth" });
    }, 100);
  }, []);

  const {
    templistCards,
    savedTemplists,
    handleDelete,
    setSavedTemplists,
    changeLayout,
    layout,
  } = useTemplistContext();

  function handleExportSaved() {}

  const [openDialog, setOpenDialog] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  function handleExportAll() {
    const json_lists = JSON.stringify({ templists: templistCards }, null, 2);
    setExportMessage(json_lists);
    setOpenDialog(true);
  }

  function handleSaveAll() {
    setSavedTemplists(templistCards);
    localStorage.setItem(
      "Templists",
      JSON.stringify({ templists: templistCards }),
    );

    toast.success("All templists have been saved!");
  }

  function handleUnsaveAll() {
    setSavedTemplists([]);
    localStorage.removeItem("Templists");
    toast.success("Saved templists cleared!");
  }

  function deleteAll() {
    templistCards.forEach((card) => {
      handleDelete(card.ulid);
    });

    toast.success("All templists have been deleted!");
  }

  function deleteAllSaved() {
    savedTemplists.forEach((card) => {
      handleDelete(card.ulid);
    });

    toast.success("All saved templists have been deleted!");
  }

  const titleCount: Record<string, number> = {};

  return (
    <Sidebar
      collapsible={"offcanvas"}
      side="right"
      {...props}
      className="w-full md:w-84"
    >
      <SidebarContent>
        <div className="m-6 mb-0 flex justify-end">
          <button onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="hidden md:flex">
            Layout Options
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {layout !== "list" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button onClick={() => changeLayout("list")}>
                      <Rows2 className="h-4 w-4" />
                      <span>Switch to list layout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {layout !== "grid" && (
                <SidebarMenuItem className="hidden md:block">
                  <SidebarMenuButton asChild>
                    <button onClick={() => changeLayout("grid")}>
                      <Grid2x2 className="h-4 w-4" />
                      <span>Switch to grid layout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {layout !== "masonry" && templistCards.length > 3 && (
                <SidebarMenuItem className="hidden lg:block">
                  <SidebarMenuButton asChild>
                    <button onClick={() => changeLayout("masonry")}>
                      <LayoutPanelLeft className="h-4 w-4" />
                      <span>Switch to masonry layout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Templists Options</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportAll();
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export All Templists</span>
                  </button>

                  <ExportDialog
                    open={openDialog}
                    onOpenChange={setOpenDialog}
                    message={exportMessage}
                  />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button onClick={handleExportSaved}>
                  <Download className="h-4 w-4" />
                  <span>Export Saved Templists</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button onClick={handleSaveAll}>
                  <Save className="h-4 w-4" />
                  <span>Save All Templists</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <AlertWithDialog
                  handleOnClick={deleteAll}
                  message="This action cannot be undone. This will permanently delete all templists."
                >
                  <Trash className="h-4 w-4" />
                  Delete All Templists
                </AlertWithDialog>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button onClick={handleUnsaveAll}>
                  <SaveOff className="h-4 w-4" />
                  <span>Unsave All Saved Templists</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <AlertWithDialog
                  handleOnClick={deleteAllSaved}
                  message="This action cannot be undone. This will permanently delete all saved templists."
                >
                  <Trash className="h-4 w-4" />
                  Delete All Saved Templists
                </AlertWithDialog>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          {savedTemplists.length > 0 && (
            <SidebarGroupLabel>Saved Templists</SidebarGroupLabel>
          )}
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
                      <Link
                        href={`#${item.ulid}`}
                        onClick={handleClickTemplist}
                      >
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
      <SidebarFooter className="text-sidebar-foreground/70 mb-4 text-center text-sm">
        <div>By Jukelyn</div>
        <div className="-mb-1">&darr;</div>
        <Link
          href={"https://github.com/Jukelyn"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center"
        >
          <Image
            alt="Github Badge"
            src={
              "https://img.shields.io/badge/github-%23171717.svg?style=for-the-badge&logo=github&logoColor=grey"
            }
            width={0}
            height={0}
            unoptimized
            className="h-auto w-40"
          />
        </Link>
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link
            href="https://www.gnu.org/licenses/gpl-3.0.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            GPL-3.0
          </Link>
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
