
'use client';

import { useUser } from "@/firebase";
import { useOnboarding } from "@/hooks/use-onboarding";
import DashboardStats from '@/components/dashboard/dashboard-stats';
import RecentWorks from '@/components/dashboard/recent-works';
import ActionCards from '@/components/dashboard/action-cards';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";

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

  const userDocRef = useMemoFirebase(() => (firestore && user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const walletRef = useMemoFirebase(() => (firestore && user ? doc(firestore, 'wallets', user.uid) : null), [firestore, user]);
  const { data: walletData, isLoading: isWalletLoading } = useDoc(walletRef);

  const isLoading = isUserLoading || isUserDocLoading || isWalletLoading;
  const username = userData?.username || user?.email?.split('@')[0];

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader username={username} isLoading={isLoading} />
      <DashboardStats walletData={walletData} user={user} isLoading={isLoading} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentWorks user={user} isLoading={isLoading} />
        <ActionCards walletData={walletData} user={user} isLoading={isLoading} />
      </div>
    </div>
  );
}
