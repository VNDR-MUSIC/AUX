
"use client";

import Image from "next/image";
import Link from "next/link";
import { WithId } from "@/firebase";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";


interface TrackCardProps {
  track: WithId<{
    title: string;
    artistId: string;
    artistName?: string;
    genre?: string;
    coverArtUrl?: string;
    price?: number;
  }>;
}

export default function TrackCard({ track }: TrackCardProps) {
  const hasPrice = track.price && track.price > 0;

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-0">
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
