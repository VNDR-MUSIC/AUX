import { FirebaseClientProvider } from '@/firebase';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </main>
    </FirebaseClientProvider>
  );
}
