'use client';
import Footer from "@/components/layout/footer";
import MusicPlayer from "@/components/layout/music-player";
import { FirebaseClientProvider } from "@/firebase";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/sidebar-nav";
import SymbiChatWidget from "@/components/symbi/symbi-chat-widget";
import SessionRewindTracker from "@/components/session-rewind-tracker";
import SessionRewind from "@/components/session-rewind";
import VideoBackground from "@/components/layout/video-background";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
        <SidebarProvider>
            <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden">
                <VideoBackground />
                <SessionRewind />
                <div className="flex flex-1 relative z-10">
                    <Sidebar>
                        <SidebarNav />
                    </Sidebar>
                    <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background/70 rounded-tl-lg">
                        {children}
                    </main>
                </div>
                <div className="relative z-10">
                  <Footer />
                </div>
                <MusicPlayer />
                <SymbiChatWidget />
                <SessionRewindTracker />
            </div>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
