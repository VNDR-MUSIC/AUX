
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, HandCoins } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { claimDailyTokensAction } from '@/app/actions/vsd-transaction';
import type { User } from 'firebase/auth';
import type { DocumentData } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface ActionCardsProps {
  userData: DocumentData | null;
  user: User | null;
  isLoading: boolean;
}

export default function ActionCards({ userData, user, isLoading }: ActionCardsProps) {
  const { toast } = useToast();

  const handleClaimTokens = async () => {
    if (!user) return;
    const result = await claimDailyTokensAction(user.uid);
    toast({
      title: result.success ? 'Success!' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const canClaimTokens = userData?.dailyTokenClaimed !== today;

  if (isLoading) {
      return (
        <Card>
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent><Skeleton className="h-10 w-full" /></CardContent>
        </Card>
      )
  }

  return (
    <Card className='h-full'>
        <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
            Daily Reward
        </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
            Claim your daily VSD-lite credits just for being an active member
            of the VNDR community.
        </p>
        <Button
            className="w-full"
            onClick={handleClaimTokens}
            disabled={!canClaimTokens || !user}
        >
            <HandCoins className="mr-2 h-4 w-4" />
            {canClaimTokens ? 'Claim 5 VSD-lite' : 'Daily Credits Claimed'}
        </Button>
        </CardContent>
    </Card>
  );
}
