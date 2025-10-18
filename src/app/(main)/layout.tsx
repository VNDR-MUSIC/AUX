
'use client';
import Footer from "@/components/layout/footer";
import MusicPlayer from "@/components/layout/music-player";
import { FirebaseClientProvider } from "@/firebase";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/sidebar-nav";
import SymbiChatWidget from "@/components/symbi/symbi-chat-widget";
import SessionRewindTracker from "@/components/session-rewind-tracker";
import SessionRewind from "@/components/session-rewind";
import VideoBackground from "@/components/layout/video-background";
import MiuSlideOut from "@/components/layout/miu-slide-out";
import Header from "@/components/layout/header";

function AppContent({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="relative z-10 flex flex-1">
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-card/80 rounded-tl-lg">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          <VideoBackground />
          <SessionRewind />
          <MiuSlideOut />
          
          <div className="flex flex-1 flex-col justify-between">
            <AppContent>{children}</AppContent>
            <div className="relative z-20">
              <Footer />
            </div>
          </div>
          
          <div className="relative z-30">
            <MusicPlayer />
          </div>
          <SymbiChatWidget />
          <SessionRewindTracker />
        </div>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
