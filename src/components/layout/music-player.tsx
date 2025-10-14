import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Mic2, ListMusic, Laptop2, Volume1, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function MusicPlayer() {
  const currentTrackImg = PlaceHolderImages.find(img => img.id === 'album-2');

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 w-1/3">
          {currentTrackImg && (
            <Image
              src={currentTrackImg.imageUrl}
              alt="Current track album art"
              width={56}
              height={56}
              className="rounded-md object-cover"
              data-ai-hint={currentTrackImg.imageHint}
            />
          )}
          <div>
            <p className="font-semibold text-sm truncate">Crystal Caverns</p>
            <p className="text-xs text-muted-foreground truncate">Pixel Pulse</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" className="h-10 w-10">
              <Pause className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-xs">
            <span className="text-xs text-muted-foreground">2:06</span>
            <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            <span className="text-xs text-muted-foreground">4:12</span>
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
            <Volume1 className="h-4 w-4 hidden sm:block" />
            <Slider defaultValue={[80]} max={100} step={1} className="w-24 hidden sm:block" />
          </div>
        </div>
      </div>
    </footer>
  );
}
