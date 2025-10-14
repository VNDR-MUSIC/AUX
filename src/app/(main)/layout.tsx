import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MusicPlayer from "@/components/layout/music-player";
import SidebarNav from "@/components/layout/sidebar-nav";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { FirebaseClientProvider } from "@/firebase";
import PageTransition from "@/components/layout/page-transition";
import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <SidebarProvider>
        <Sidebar side="left" variant="inset" collapsible="icon">
          <SidebarNav />
        </Sidebar>
        <div className="flex flex-col min-h-screen">
          <SidebarInset className="pb-24 flex flex-col">
            <Header />
            <PageTransition>
              <main className="flex-1 p-4 md:p-6">{children}</main>
            </PageTransition>
            <Footer />
          </SidebarInset>
          <MusicPlayer />
        </div>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
