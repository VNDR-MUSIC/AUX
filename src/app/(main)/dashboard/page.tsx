
'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Music, Play, PlusCircle, HandCoins } from "lucide-react";
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
import { useUser, useFirebase, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";
import { claimDailyTokensAction } from "@/app/actions/user";
import { useToast } from "@/hooks/use-toast";
import { useMusicPlayer } from "@/store/music-player-store";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const { playTrack } = useMusicPlayer();

  const userRef = useMemoFirebase(() => (firestore && user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userRef);

  const tracksQuery = useMemoFirebase(() => (firestore && user ? query(collection(firestore, 'tracks'), where('artistId', '==', user.uid)) : null), [firestore, user]);
  const { data: tracks, isLoading: areTracksLoading } = useCollection(tracksQuery);

  const nowPlayingImg = PlaceHolderImages.find(img => img.id === 'album-2');

  const handleClaimTokens = async () => {
    if (!user) return;
    const result = await claimDailyTokensAction(user.uid);
    toast({
      title: result.success ? "Success!" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const canClaimTokens = userData?.dailyTokenClaimed !== today;

  if (isUserLoading || isUserDataLoading || areTracksLoading) {
    return (
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-6 flex-1" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-8">
            <Card>
                <CardHeader><Skeleton className="h-8 w-32" /></CardHeader>
                <CardContent><Skeleton className="h-10 w-full" /></CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-8 w-40" /></CardHeader>
                <CardContent><Skeleton className="h-10 w-full" /></CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="font-headline">Welcome, {userData?.username || 'Artist'}!</CardTitle>
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
          {tracks && tracks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Your Tracks</TableHead>
                  <TableHead className="hidden sm:table-cell">Genre</TableHead>
                  <TableHead className="hidden md:table-cell">Plays</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tracks.map((track) => (
                  <TableRow key={track.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                          <Image
                            alt={track.title}
                            className="aspect-square rounded-md object-cover"
                            height="40"
                            width="40"
                            src={track.coverArtUrl || 'https://picsum.photos/seed/placeholder/40/40'}
                            data-ai-hint="album art"
                          />
                        <div className="font-medium">{track.title}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{track.genre}</TableCell>
                    <TableCell className="hidden md:table-cell">{track.plays || 0}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-1 font-bold">
                        {track.price > 0 ? (
                            <>
                                <Icons.vsd className="h-4 w-4" />
                                {track.price}
                            </>
                        ) : (
                           'N/A'
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Music className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tracks uploaded yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Start by uploading your first track.</p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/dashboard/upload">Upload Music</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid auto-rows-min gap-4 md:gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center justify-between">VSD Token Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-4 text-4xl font-bold font-headline">
                    <Icons.vsd className="h-8 w-8" />
                    <span>{userData?.vsdBalance || 0}</span>
                </div>
                <Button className="w-full" onClick={handleClaimTokens} disabled={!canClaimTokens}>
                    <HandCoins className="mr-2 h-4 w-4" />
                    {canClaimTokens ? "Claim Daily 5 VSD" : "Daily Tokens Claimed"}
                </Button>
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
