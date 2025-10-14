import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Music, Play, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import RecommendationsClient from "@/components/dashboard/recommendations-client";
import TopTracksChart from "@/components/dashboard/top-tracks-chart";

const popularTracks = [
  { title: "Midnight Bloom", artist: "Synthwave Samurai", plays: "2.1M", duration: "3:45" },
  { title: "Crystal Caverns", artist: "Pixel Pulse", plays: "1.8M", duration: "4:12" },
  { title: "Neon Drive", artist: "Future Funksters", plays: "1.5M", duration: "2:58" },
  { title: "Lunar Tides", artist: "Cosmic Drifters", plays: "1.2M", duration: "5:02" },
  { title: "Streetlight Sonata", artist: "Urban Echoes", plays: "980K", duration: "3:15" },
];

export default function DashboardPage() {
  const nowPlayingImg = PlaceHolderImages.find(img => img.id === 'album-2');
  const trackImage = PlaceHolderImages.find(p => p.id === 'album-1');

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="font-headline">Welcome, Artist! </CardTitle>
            <CardDescription>
              Here&apos;s an overview of your music and performance.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/dashboard/upload">
              Upload Music
              <PlusCircle className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Popular Tracks</TableHead>
                <TableHead className="hidden sm:table-cell">Artist</TableHead>
                <TableHead className="hidden md:table-cell">Plays</TableHead>
                <TableHead className="text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularTracks.map((track) => (
                <TableRow key={track.title}>
                  <TableCell>
                    <div className="font-medium">{track.title}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{track.artist}</TableCell>
                  <TableCell className="hidden md:table-cell">{track.plays}</TableCell>
                  <TableCell className="text-right">{track.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid auto-rows-min gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-between">
              <span>Now Playing</span>
              <Badge variant="outline" className="font-mono">LIVE</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            {nowPlayingImg && (
              <Image
                alt="Album art"
                className="aspect-square rounded-lg object-cover"
                height="100"
                width="100"
                src={nowPlayingImg.imageUrl}
                data-ai-hint={nowPlayingImg.imageHint}
              />
            )}
            <div className="grid gap-1">
              <h3 className="font-semibold">Crystal Caverns</h3>
              <p className="text-sm text-muted-foreground">Pixel Pulse</p>
              <div className="flex items-center gap-2">
                <div className="h-1 w-full flex-1 rounded-full bg-muted">
                  <div className="h-1 w-1/2 rounded-full bg-primary" />
                </div>
                <span className="text-xs text-muted-foreground">2:06/4:12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <RecommendationsClient />
          </CardContent>
        </Card>
      </div>

      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle className="font-headline">Top Tracks Performance</CardTitle>
          <CardDescription>An overview of your most popular tracks this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <TopTracksChart />
        </CardContent>
      </Card>
    </div>
  );
}
