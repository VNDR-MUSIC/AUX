
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase';
import { Loader2, ShieldX, Signal, SignalHigh, SignalLow } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { subsidiaries } from '@/lib/subsidiaries';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

type Status = 'pending' | 'active' | 'offline';

interface SubsidiaryStatus {
  id: string;
  status: Status;
}

export default function SubsidiaryStatusPage() {
  const { user, isUserLoading } = useUser();

  const [statuses, setStatuses] = useState<SubsidiaryStatus[]>(
    subsidiaries.map(sub => ({ id: sub.id, status: 'pending' }))
  );

  const isAdmin = (user as any)?.admin === true;

  useEffect(() => {
    // We don't have real health check endpoints, so we'll simulate them.
    // In a real app, this would fetch from each subsidiary's /api/health endpoint.
    const checkStatuses = () => {
      setStatuses(prevStatuses =>
        prevStatuses.map(s => {
          // Simulate some services being intermittently offline
          const isOffline = s.id === 'ivtv' && Math.random() > 0.8;
          const newStatus: Status = isOffline ? 'offline' : 'active';
          return { ...s, status: newStatus };
        })
      );
    };

    // Initial check
    checkStatuses();
    // Poll every 30 seconds
    const interval = setInterval(checkStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600"><SignalHigh className="mr-1 h-3 w-3"/> Active</Badge>;
      case 'offline':
        return <Badge variant="destructive"><SignalLow className="mr-1 h-3 w-3"/> Offline</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary"><Loader2 className="mr-1 h-3 w-3 animate-spin"/> Checking...</Badge>;
    }
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center text-center">
        <ShieldX className="h-24 w-24 text-destructive mb-4" />
        <h1 className="font-headline text-4xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter md:text-5xl">Subsidiary Status</h1>
        <p className="mt-2 text-muted-foreground">Real-time health and function overview of the IMG ecosystem.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subsidiaries.map(sub => {
          const subStatus = statuses.find(s => s.id === sub.id);
          return (
            <Card key={sub.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image src={sub.logoUrl} alt={`${sub.name} Logo`} width={40} height={40} className="object-contain" />
                  <CardTitle className="font-headline text-2xl">{sub.name}</CardTitle>
                </div>
                {subStatus && getStatusBadge(subStatus.status)}
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{sub.description}</CardDescription>
                <Alert>
                  <Signal className="h-4 w-4" />
                  <AlertTitle>Core Functions</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1">
                      {sub.functions.map((func, i) => (
                        <li key={i}>{func}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
