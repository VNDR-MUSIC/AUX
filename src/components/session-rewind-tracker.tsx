
'use client';

import { useUser } from '@/firebase';
import { useEffect } from 'react';

// Extend the Window interface to include sessionRewind
declare global {
  interface Window {
    sessionRewind?: {
      identifyUser: (userInfo: { userId: string; [key: string]: string }) => void;
    };
  }
}

export default function SessionRewindTracker() {
  const { user } = useUser();

  useEffect(() => {
    // Check if the sessionRewind object and identifyUser function exist on the window
    if (user && window.sessionRewind && typeof window.sessionRewind.identifyUser === 'function') {
      window.sessionRewind.identifyUser({
        userId: user.uid,
        email: user.email || 'N/A',
        // You can add more user properties here if needed
        // e.g., name: user.displayName || 'Anonymous'
      });
    }
  }, [user]);

  return null; // This component does not render anything
}
