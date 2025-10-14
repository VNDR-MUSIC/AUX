import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MusicPlayer from "@/components/layout/music-player";
import { FirebaseClientProvider } from "@/firebase";
import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 md:p-6">{children}</main>
          <Footer />
        <MusicPlayer />
      </div>
    </FirebaseClientProvider>
  );
}
