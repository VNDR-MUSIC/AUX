
'use client';

import { create } from 'zustand';
import { WithId } from '@/firebase';

export type Track = WithId<{
  title: string;
  artistId: string;
  artistName?: string;
  genre?: string;
  coverArtUrl?: string;
  trackUrl?: string;
  price?: number;
}>;

interface MusicPlayerState {
  playlist: Track[];
  currentTrack: Track | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  
  setPlaylist: (tracks: Track[]) => void;
  playTrack: (track: Track, playlist?: Track[]) => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

export const useMusicPlayer = create<MusicPlayerState>((set, get) => ({
  playlist: [],
  currentTrack: null,
  currentTrackIndex: -1,
  isPlaying: false,

  setPlaylist: (tracks) => set({ playlist: tracks }),

  playTrack: (track, playlist) => {
    const { currentTrack, play } = get();
    if (playlist) {
      set({ playlist });
    }
    const newPlaylist = playlist || get().playlist;
    const trackIndex = newPlaylist.findIndex(t => t.id === track.id);
    
    set({
      currentTrack: track,
      currentTrackIndex: trackIndex,
      isPlaying: true,
    });
    
    // In a real app, you would handle audio playback here.
    // For example:
    // const audio = new Audio(track.trackUrl);
    // audio.play();
  },

  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),

  nextTrack: () => {
    const { playlist, currentTrackIndex, playTrack } = get();
    if (playlist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      playTrack(playlist[nextIndex]);
    }
  },

  prevTrack: () => {
    const { playlist, currentTrackIndex, playTrack } = get();
    if (playlist.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      playTrack(playlist[prevIndex]);
    }
  },
}));
