
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play } from "lucide-react";
import { useMusicPlayer, Track } from "@/store/music-player-store";


interface TrackCardProps {
  track: Track;
  playlist?: Track[];
}

export default function TrackCard({ track, playlist }: TrackCardProps) {
  const hasPrice = track.price && track.price > 0;
  const { playTrack } = useMusicPlayer();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    playTrack(track, playlist);
  };

  return (
    <Card className="overflow-hidden flex flex-col group">
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={1 / 1}>
            <Link href={`/profile/${track.artistId}`}>
                <Image
                    src={track.coverArtUrl || 'https://picsum.photos/seed/placeholder/400/400'}
                    alt={track.title}
                    fill
                    className="object-cover"
                    data-ai-hint="album art"
                />
            </Link>
        </AspectRatio>
         <Button
          size="icon"
          className="absolute bottom-2 right-2 z-10 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handlePlay}
        >
          <Play className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg truncate">{track.title}</h3>
        {track.artistName && (
           <Link href={`/profile/${track.artistId}`} className="text-sm text-muted-foreground hover:underline truncate">
            {track.artistName}
          </Link>
        )}
        {track.genre && (
          <Badge variant="outline" className="mt-2">{track.genre}</Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {hasPrice ? (
          <div className="flex items-center gap-1 font-bold text-lg">
            <Icons.vsd className="h-5 w-5" />
            <span>{track.price}</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Not for license</div>
        )}
        <Button asChild size="sm" disabled={!hasPrice}>
            <Link href={hasPrice ? "/dashboard/licensing" : "#"}>License</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
