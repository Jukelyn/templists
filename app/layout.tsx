import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import TemplistLayoutClient from "@/components/ui/templist/TemplistLayoutClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Templists App",
  description: "A temporary checklists app by Jukelyn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <SidebarProvider defaultOpen={false}>
            <TemplistLayoutClient>{children}</TemplistLayoutClient>
          </SidebarProvider>
        </TooltipProvider>

        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}
