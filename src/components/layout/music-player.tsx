
'use client';

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, SkipBack, SkipForward, ListMusic, Laptop2, Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMusicPlayer } from "@/store/music-player-store";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MusicPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    play, 
    pause, 
    nextTrack, 
    prevTrack, 
    volume, 
    setVolume,
    isMuted,
    toggleMute,
  } = useMusicPlayer();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
            if (currentTrack?.trackUrl === "https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/example-track.mp3?alt=media") {
                toast({
                    title: "Demo Audio",
                    description: "This is a placeholder audio track. You can replace it by uploading your own music!",
                });
            } else {
                console.error("Audio play failed:", e)
            }
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, toast]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4 hidden sm:block" />;
    if (volume < 0.5) return <Volume1 className="h-4 w-4 hidden sm:block" />;
    return <Volume2 className="h-4 w-4 hidden sm:block" />;
  }

  if (!currentTrack) {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm">
            <div className="flex h-20 items-center justify-center px-4 text-muted-foreground">
                <p>No music selected. <Link href="/dashboard/catalog" className="text-primary hover:underline">Choose a track</Link> to start playing.</p>
            </div>
        </footer>
    )
  }

  return (
    <>
    {currentTrack.trackUrl && (
        <audio 
            ref={audioRef}
            src={currentTrack.trackUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={nextTrack}
            autoPlay={isPlaying}
        />
    )}
    <footer className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 w-1/3">
          {currentTrack.coverArtUrl && (
            <Image
              src={currentTrack.coverArtUrl}
              alt="Current track album art"
              width={56}
              height={56}
              className="rounded-md object-cover"
              data-ai-hint="album art"
            />
          )}
          <div>
            <p className="font-semibold text-sm truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artistName}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevTrack}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" className="h-10 w-10" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextTrack}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-xs">
            <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
            <Slider value={[progress]} max={duration || 1} step={1} onValueChange={handleProgressChange} className="w-full" />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-1/3 justify-end">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <ListMusic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Laptop2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8 hidden sm:flex">
                {getVolumeIcon()}
            </Button>
            <Slider value={[isMuted ? 0 : volume]} onValueChange={(v) => setVolume(v[0])} max={1} step={0.05} className="w-24 hidden sm:block" />
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
