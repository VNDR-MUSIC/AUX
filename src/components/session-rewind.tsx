
'use client';

import { useUser, FirebaseClientProvider } from '@/firebase';
import Script from 'next/script';
import { useEffect } from 'react';

// Extend the Window interface to include sessionRewind
declare global {
  interface Window {
    SessionRewindConfig?: any;
    sessionRewind?: {
      identifyUser: (userInfo: { userId: string; [key: string]: string }) => void;
    };
  }
}

function SessionRewindTracker() {
  const { user } = useUser();

  useEffect(() => {
    if (user && window.sessionRewind) {
      window.sessionRewind.identifyUser({
        userId: user.uid,
        email: user.email || 'N/A',
      });
    }
  }, [user]);

  return null; // This component does not render anything
}

export default function SessionRewind() {
  return (
    <>
      <Script
        id="session-rewind-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function (o) {
                var w = window;
                w.SessionRewindConfig = o;
                var f = document.createElement("script");
                f.async = 1, f.crossOrigin = "anonymous",
                  f.src = "https://rec.sessionrewind.com/srloader.js";
                var g = document.getElementsByTagName("head")[0];
                g.insertBefore(f, g.firstChild);
              }({
                apiKey: 'P5ytM37jER8kxBLqXGq9H9vgmeCq6Hw19ojgWNFv',
                startRecording: true,
              });
          `,
        }}
      />
      <FirebaseClientProvider>
          <SessionRewindTracker />
      </FirebaseClientProvider>
    </>
  );
}
