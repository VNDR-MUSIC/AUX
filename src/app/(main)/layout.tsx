
'use client';
import Footer from "@/components/layout/footer";
import MusicPlayer from "@/components/layout/music-player";
import { FirebaseClientProvider } from "@/firebase";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/sidebar-nav";
import SymbiChatWidget from "@/components/symbi/symbi-chat-widget";
import SessionRewindTracker from "@/components/session-rewind-tracker";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
        <SidebarProvider>
            <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden">
                <div className="flex flex-1">
                    <Sidebar>
                        <SidebarNav />
                    </Sidebar>
                    <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background/80 backdrop-blur-lg rounded-tl-lg">
                        {children}
                    </main>
                </div>
                <Footer />
                <MusicPlayer />
                <SymbiChatWidget />
                <SessionRewindTracker />
            </div>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
