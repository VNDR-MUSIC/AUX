
import { FirebaseClientProvider } from '@/firebase';
import React from 'react';
import Footer from '@/components/layout/footer';
import MiuSlideOut from '@/components/layout/miu-slide-out';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen flex-col">
        <MiuSlideOut />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          {children}
        </main>
        <Footer />
      </div>
    </FirebaseClientProvider>
  );
}
