
'use client';

import { useUser, useCollection } from "@/firebase";
import { useOnboarding } from "@/hooks/use-onboarding";
import DashboardStats from '@/components/dashboard/dashboard-stats';
import ActionCards from '@/components/dashboard/action-cards';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";
import { useDoc } from "@/firebase";
import { doc, query } from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";
import RecentWorks from "@/components/dashboard/recent-works";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TopTracksChart from "@/components/dashboard/top-tracks-chart";
import { Track } from "@/store/music-player-store";
import RecommendationsClient from "@/components/dashboard/recommendations-client";
import { useMemo } from "react";

function DashboardHeader({
  username,
  isLoading,
}: {
  username?: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl">
          Welcome, {username || 'Artist'}!
        </h1>
        <p className="text-muted-foreground">
          Here is the latest snapshot of your music ecosystem.
        </p>
      </div>
      <Button asChild size="sm" className="ml-auto gap-1">
        <Link href="/dashboard/upload">
          Upload Work
          <Upload className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  useOnboarding('dashboard');

  const userDocRef = useMemo(() => (firestore && user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const { data: allWorks, isLoading: areWorksLoading } = useCollection<Track>('works');
  
  const recentWorks = useMemo(() => allWorks?.sort((a, b) => (b.uploadDate as any) - (a.uploadDate as any)).slice(0, 5) || [], [allWorks]);
  const topWorks = useMemo(() => allWorks?.sort((a, b) => (b.plays || 0) - (a.plays || 0)) || [], [allWorks]);

  const totalPlays = useMemo(() => allWorks?.reduce((acc, work) => acc + (work.plays || 0), 0) || 0, [allWorks]);

  const isLoading = isUserLoading || isUserDocLoading || areWorksLoading;
  const username = userData?.username || user?.email?.split('@')[0];

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader username={username} isLoading={isLoading} />
      <DashboardStats 
        userData={userData} 
        isLoading={isLoading} 
        totalWorks={allWorks?.length}
        totalPlays={totalPlays}
      />
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-7">
         <Card className="lg:col-span-3 row-span-1">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>
              Personalized suggestions based on your listening habits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecommendationsClient />
          </CardContent>
        </Card>
        <Card className="lg:col-span-4 row-span-2">
            <CardHeader>
                <CardTitle>Top Performing Tracks</CardTitle>
                <CardDescription>
                    Your most played tracks this month.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                       <Skeleton className="h-[200px] w-full" />
                    </div>
                ) : (
                    <TopTracksChart data={topWorks || []} />
                )}
            </CardContent>
        </Card>
         <Card className="lg:col-span-3 row-span-1">
            <ActionCards userData={userData} user={user} isLoading={isLoading} />
        </Card>
        <div className="lg:col-span-7">
           <RecentWorks works={recentWorks} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
