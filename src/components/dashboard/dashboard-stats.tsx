
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import { Music, FileText, BarChart, Wallet } from 'lucide-react';
import type { DocumentData } from 'firebase/firestore';

interface DashboardStatsProps {
    userData: DocumentData | null;
    isLoading: boolean;
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

export default function DashboardStats({ userData, isLoading }: DashboardStatsProps) {
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
        value="N/A"
        icon={<Music className="h-4 w-4 text-muted-foreground" />}
        description="View in 'My Works'"
        isLoading={isLoading}
      />
      <StatCard
        title="Licenses"
        value="N/A"
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        description="View in 'Licensing'"
        isLoading={isLoading}
      />
      <StatCard
        title="Exposure Score"
        value="N/A"
        icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
        description="Calculated by Muso.ai"
        isLoading={isLoading}
      />
    </div>
  );
}
