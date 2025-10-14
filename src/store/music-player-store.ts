

'use client';

import { create } from 'zustand';
import { WithId } from '@/firebase';
import { trackPlays } from '@/app/actions/music';

export type Track = WithId<{
  title: string;
  artistId: string;
  artistName?: string;
  genre?: string;
  coverArtUrl?: string;
  trackUrl?: string;
  price?: number;
  plays?: number;
}>;

interface MusicPlayerState {
  playlist: Track[];
  currentTrack: Track | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  
  setPlaylist: (tracks: Track[]) => void;
  playTrack: (track: Track, playlist?: Track[]) => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export const useMusicPlayer = create<MusicPlayerState>((set, get) => ({
  playlist: [],
  currentTrack: null,
  currentTrackIndex: -1,
  isPlaying: false,
  volume: 0.8,
  isMuted: false,

  setPlaylist: (tracks) => set({ playlist: tracks }),

  playTrack: (track, playlist) => {
    const { currentTrack } = get();
    // Only increment play count if it's a new track
    if (currentTrack?.id !== track.id) {
      trackPlays(track.id);
    }
    
    const newPlaylist = playlist || get().playlist;
    const trackIndex = newPlaylist.findIndex(t => t.id === track.id);
    
    set({
      currentTrack: track,
      playlist: newPlaylist,
      currentTrackIndex: trackIndex,
      isPlaying: true,
    });
  },

  play: () => {
    if (get().currentTrack) {
        set({ isPlaying: true });
    }
  },
  
  pause: () => set({ isPlaying: false }),

  nextTrack: () => {
    const { playlist, currentTrackIndex, playTrack } = get();
    if (playlist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      playTrack(playlist[nextIndex], playlist);
    }
  },

  prevTrack: () => {
    const { playlist, currentTrackIndex, playTrack } = get();
    if (playlist.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      playTrack(playlist[prevIndex], playlist);
    }
  },

  setVolume: (volume) => {
    set({ volume, isMuted: volume === 0 });
  },

  toggleMute: () => {
    set(state => ({ isMuted: !state.isMuted }));
  }
}));
