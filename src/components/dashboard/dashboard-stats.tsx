
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import { Music, FileText, BarChart, Wallet, PlayCircle } from 'lucide-react';
import type { DocumentData } from 'firebase/firestore';

interface DashboardStatsProps {
    userData: DocumentData | null;
    isLoading: boolean;
    totalWorks: number | undefined;
    totalPlays: number | undefined;
}

function StatCard({ title, value, icon, description, isLoading }: { title: string, value: string | number, icon: React.ReactNode, description: string, isLoading: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                    </>
                ) : (
                    <>
                        <div className="text-2xl font-bold">{value}</div>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default function DashboardStats({ userData, isLoading, totalWorks, totalPlays }: DashboardStatsProps) {

  // Since we are now fetching a real score, we can display it.
  const musoExposureScore = userData?.musoExposureScore;
  const averageScore = userData?.averageMusoExposureScore || 'N/A';

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <StatCard
        title="VSD-lite Balance"
        value={userData?.vsdBalance ?? 0}
        icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        description="Used for platform services"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Works"
        value={totalWorks ?? 0}
        icon={<Music className="h-4 w-4 text-muted-foreground" />}
        description="Tracks in your catalog"
        isLoading={isLoading}
      />
       <StatCard
        title="Total Plays"
        value={totalPlays ?? 0}
        icon={<PlayCircle className="h-4 w-4 text-muted-foreground" />}
        description="Across the entire platform"
        isLoading={isLoading}
      />
      <StatCard
        title="Exposure Score"
        value={averageScore}
        icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
        description="Avg. score from Muso.ai"
        isLoading={isLoading}
      />
    </div>
  );
}
