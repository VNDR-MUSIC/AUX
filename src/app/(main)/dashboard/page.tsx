
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
import { doc, collection, query, where, orderBy, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";
import { claimDailyTokensAction } from "@/app/actions/vsd-transaction";
import { useToast } from "@/hooks/use-toast";
import { useMusicPlayer } from "@/store/music-player-store";
import { useOnboarding } from "@/hooks/use-onboarding";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const { playTrack } = useMusicPlayer();
  
  useOnboarding('dashboard');

  const userRef = useMemoFirebase(() => (firestore && user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userRef);

  const artistTracksQuery = useMemoFirebase(() => (firestore && user ? query(collection(firestore, 'tracks'), where('artistId', '==', user.uid)) : null), [firestore, user]);
  const { data: artistTracks, isLoading: areArtistTracksLoading } = useCollection(artistTracksQuery);

  // New query for all tracks, ordered by plays
  const allTracksQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'tracks'), orderBy('plays', 'desc'), limit(10)) : null), [firestore]);
  const { data: allTracks, isLoading: areAllTracksLoading } = useCollection(allTracksQuery);

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

  const isLoading = isUserLoading || isUserDataLoading || areArtistTracksLoading || areAllTracksLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2 backdrop-blur-lg bg-card/40">
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
            <Card className="backdrop-blur-lg bg-card/40">
                <CardHeader><Skeleton className="h-8 w-32" /></CardHeader>
                <CardContent><Skeleton className="h-10 w-full" /></CardContent>
            </Card>
            <Card className="backdrop-blur-lg bg-card/40">
                <CardHeader><Skeleton className="h-8 w-40" /></CardHeader>
                <CardContent><Skeleton className="h-10 w-full" /></CardContent>
            </Card>
        </div>
         <Card className="xl:col-span-3 backdrop-blur-lg bg-card/40">
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-min gap-4 sm:gap-6 md:gap-8">
      <Card className="lg:col-span-2 backdrop-blur-lg bg-card/40">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="grid gap-2 flex-1">
            <CardTitle className="font-headline text-2xl sm:text-3xl">Welcome, {userData?.username || 'Artist'}!</CardTitle>
            <CardDescription>
              This is your Artist Studio. Here's an overview of your music and performance.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1 w-full sm:w-auto">
            <Link href="/dashboard/upload">
              Upload Music
              <PlusCircle className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {artistTracks && artistTracks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Your Tracks</TableHead>
                    <TableHead className="hidden sm:table-cell">Genre</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Plays</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artistTracks.map((track) => (
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
                          <div className="font-medium truncate max-w-32 sm:max-w-none">{track.title}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{track.genre}</TableCell>
                      <TableCell className="hidden md:table-cell text-center">{track.plays || 0}</TableCell>
                      <TableCell className="text-right">
                          {track.price > 0 ? (
                              <div className="flex items-center justify-end gap-1 font-bold">
                                  <Link href="https://vsd.network" target="_blank" rel="noopener noreferrer"><Icons.vsd className="h-4 w-4"/></Link>
                                  {track.price}
                              </div>
                          ) : (
                             'N/A'
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tracks uploaded yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Start by uploading your first track to see your dashboard come to life.</p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/dashboard/upload">Upload Music</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid auto-rows-min gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-1">
        <Card className="backdrop-blur-lg bg-card/40">
            <CardHeader>
                <CardTitle className="font-headline flex items-center justify-between text-2xl">VSD Token Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-bold font-headline">
                    <Link href="https://vsd.network" target="_blank" rel="noopener noreferrer"><Icons.vsd className="h-7 w-7 sm:h-8 sm:w-8" /></Link>
                    <span>{userData?.vsdBalance || 0}</span>
                </div>
                <Button className="w-full" onClick={handleClaimTokens} disabled={!canClaimTokens}>
                    <HandCoins className="mr-2 h-4 w-4" />
                    {canClaimTokens ? "Claim Daily 5 VSD" : "Daily Tokens Claimed"}
                </Button>
            </CardContent>
        </Card>

        <Card className="backdrop-blur-lg bg-card/40">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">AI-Powered Growth Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <RecommendationsClient />
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-3 backdrop-blur-lg bg-card/40">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl">Top Tracks Performance</CardTitle>
          <CardDescription>An overview of the most popular tracks on the platform this month.</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] sm:h-[300px]">
          <TopTracksChart data={allTracks || []} />
        </CardContent>
      </Card>
    </div>
  );
}
