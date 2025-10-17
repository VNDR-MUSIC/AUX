
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import { Music, FileText, BarChart } from 'lucide-react';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import type { User } from 'firebase/auth';
import type { DocumentData } from 'firebase/firestore';

interface DashboardStatsProps {
    userData: DocumentData | null;
    user: User | null;
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

export default function DashboardStats({ userData, user, isLoading: isParentLoading }: DashboardStatsProps) {
  const { firestore } = useFirebase();

  const worksQuery = useMemoFirebase(() => (firestore && user ? query(collection(firestore, 'works'), where('artistId', '==', user.uid)) : null), [firestore, user]);
  const { data: works, isLoading: areWorksLoading } = useCollection(worksQuery);
  
  const licenseQuery = useMemoFirebase(() => (firestore && user ? query(collection(firestore, 'license_requests'), where('artistId', '==', user.uid)) : null), [firestore, user]);
  const { data: licenses, isLoading: areLicensesLoading } = useCollection(licenseQuery);

  const isLoading = isParentLoading || areWorksLoading || areLicensesLoading;

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <StatCard
        title="VSD-lite Balance"
        value={userData?.vsdBalance ?? 0}
        icon={<Icons.vsd className="h-4 w-4 text-muted-foreground" />}
        description="Used for platform services"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Works"
        value={works?.length || 0}
        icon={<Music className="h-4 w-4 text-muted-foreground" />}
        description="In your catalog"
        isLoading={isLoading}
      />
      <StatCard
        title="Licenses"
        value={licenses?.length || 0}
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        description="Active and pending requests"
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
