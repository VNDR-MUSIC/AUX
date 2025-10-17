
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play } from "lucide-react";
import { useMusicPlayer, Track } from "@/store/music-player-store";


interface TrackCardProps {
  track: Track;
  playlist?: Track[];
}

export default function TrackCard({ track, playlist }: TrackCardProps) {
  const { playTrack } = useMusicPlayer();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent card click event
    playTrack(track, playlist);
  };

  return (
    <Link href={`/profile/${track.artistId}`} className="block w-full">
        <Card className="overflow-hidden group/track-card bg-card hover:bg-muted/50 transition-colors duration-300 p-4 flex flex-col gap-4 w-full">
        <div className="overflow-hidden relative">
            <AspectRatio ratio={1 / 1} className="bg-muted rounded-md">
                <Image
                    src={track.coverArtUrl || 'https://picsum.photos/seed/placeholder/400/400'}
                    alt={track.title}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint="album art"
                />
            </AspectRatio>
            <Button
            size="icon"
            className="absolute bottom-2 right-2 z-10 rounded-full h-12 w-12 bg-primary text-primary-foreground shadow-lg
                        opacity-0 transform translate-y-2 group-hover/track-card:opacity-100 group-hover/track-card:translate-y-0
                        transition-all duration-300 ease-in-out hover:scale-110"
            onClick={handlePlay}
            >
            <Play className="h-6 w-6 fill-current" />
            </Button>
        </div>
        
        <div className="flex flex-col truncate">
            <h3 className="font-bold text-base truncate text-foreground">{track.title}</h3>
            {track.artistName && (
            <span className="text-sm text-muted-foreground hover:underline truncate">
                {track.artistName}
            </span>
            )}
        </div>
        </Card>
    </Link>
  );
}
