
import { FirebaseClientProvider } from '@/firebase';
import React from 'react';
import Footer from '@/components/layout/footer';
import MiuSlideOut from '@/components/layout/miu-slide-out';
import VideoBackground from '@/components/layout/video-background';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <div className="relative flex min-h-screen flex-col">
        <VideoBackground />
        <MiuSlideOut />
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
          {children}
        </main>
        <div className="relative z-10">
            <Footer />
        </div>
      </div>
    </FirebaseClientProvider>
  );
}
