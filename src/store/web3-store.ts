
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Web3State {
  isWeb3Enabled: boolean;
  toggleWeb3: () => void;
  setWeb3Enabled: (value: boolean) => void;
}

export const useWeb3Store = create<Web3State>()(
  persist(
    (set) => ({
      isWeb3Enabled: false, // Disabled by default
      toggleWeb3: () => set((state) => ({ isWeb3Enabled: !state.isWeb3Enabled })),
      setWeb3Enabled: (value) => set({ isWeb3Enabled: value }),
    }),
    {
      name: 'vndr-web3-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
