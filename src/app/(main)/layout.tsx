
'use client';
import Footer from "@/components/layout/footer";
import MusicPlayer from "@/components/layout/music-player";
import { FirebaseClientProvider } from "@/firebase";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/sidebar-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
        <SidebarProvider>
            <div className="flex flex-col min-h-screen">
                <div className="flex flex-1">
                    <div className="hidden md:flex flex-col">
                        <SidebarNav />
                    </div>
                    <main className="flex-1 p-4 md:p-6 bg-background/80 backdrop-blur-lg rounded-tl-lg">
                        {children}
                    </main>
                </div>
                <Footer />
                <MusicPlayer />
            </div>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
