import Header from "@/components/layout/header";
import MusicPlayer from "@/components/layout/music-player";
import SidebarNav from "@/components/layout/sidebar-nav";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar side="left" variant="inset" collapsible="icon">
        <SidebarNav />
      </Sidebar>
      <div className="flex flex-col min-h-screen">
        <SidebarInset className="pb-24">
          <Header />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
        <MusicPlayer />
      </div>
    </SidebarProvider>
  );
}
