'use client';
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MusicPlayer from "@/components/layout/music-player";
import { FirebaseClientProvider } from "@/firebase";
import React, { useState } from "react";
import FullScreenNav from "@/components/layout/full-screen-nav";

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  return (
      <div className="flex flex-col min-h-screen">
          <Header onMenuClick={() => setIsNavOpen(true)} />
          <FullScreenNav isOpen={isNavOpen} setIsOpen={setIsOpen} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
          <Footer />
        <MusicPlayer />
      </div>
  );
}


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </FirebaseClientProvider>
  );
}
