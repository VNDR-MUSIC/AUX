
'use client';

import Script from 'next/script';

// Extend the Window interface to include sessionRewind
declare global {
  interface Window {
    SessionRewindConfig?: any;
    sessionRewind?: {
      identifyUser: (userInfo: { userId: string; [key: string]: string }) => void;
    };
  }
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
    </>
  );
}
