
import { FirebaseClientProvider } from '@/firebase';
import React from 'react';
import Footer from '@/components/layout/footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          {children}
        </main>
        <Footer />
      </div>
    </FirebaseClientProvider>
  );
}
