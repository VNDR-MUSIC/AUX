
'use client';

import Link from "next/link";
import { ArrowUpRight, Music, Upload, FileText, BarChart3, HandCoins, HardHat } from "lucide-react";
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
import { useUser, useFirebase, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where, orderBy, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";
import { claimDailyTokensAction } from "@/app/actions/vsd-transaction";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  useOnboarding('dashboard');

  const walletRef = useMemoFirebase(() => (firestore && user ? doc(firestore, 'wallets', user.uid) : null), [firestore, user]);
  const { data: walletData, isLoading: isWalletLoading } = useDoc(walletRef);

  const worksQuery = useMemoFirebase(() => (firestore && user ? query(collection(firestore, 'works'), where('artistId', '==', user.uid), orderBy('uploadDate', 'desc'), limit(5)) : null), [firestore, user]);
  const { data: recentWorks, isLoading: areWorksLoading } = useCollection(worksQuery);
  
  const userDocRef = useMemoFirebase(() => (firestore && user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData } = useDoc(userDocRef);


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
  const canClaimTokens = walletData?.dailyTokenClaimed !== today;
  const isLoading = isUserLoading || isWalletLoading || areWorksLoading;

  if (isLoading) {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Skeleton className="h-32"/>
                <Skeleton className="h-32"/>
                <Skeleton className="h-32"/>
                <Skeleton className="h-32"/>
            </div>
            <Skeleton className="h-64"/>
             <Skeleton className="h-48"/>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl md:text-4xl">Welcome, {userData?.username || 'Artist'}!</h1>
            <p className="text-muted-foreground">Here is the latest snapshot of your music ecosystem.</p>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/dashboard/upload">
              Upload Work
              <Upload className="h-4 w-4" />
            </Link>
          </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              VSD-lite Balance
            </CardTitle>
            <Icons.vsd className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData?.vsdLiteBalance || 0}</div>
            <p className="text-xs text-muted-foreground">
              +10 VSD on sign up
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Works</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentWorks?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              In your catalog
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licenses</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exposure Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Calculated by Muso.ai
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Works</CardTitle>
            <CardDescription>
              Your 5 most recently uploaded works.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {recentWorks && recentWorks.length > 0 ? (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Genre</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Plays</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentWorks.map((work) => (
                    <TableRow key={work.id}>
                        <TableCell>
                            <div className="font-medium">{work.title}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {work.artistName}
                            </div>
                        </TableCell>
                         <TableCell className="hidden md:table-cell">{work.genre}</TableCell>
                         <TableCell className="hidden md:table-cell">
                             <Badge variant="outline">{work.status || 'Pending'}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{work.plays || 0}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
             ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p>You haven't uploaded any works yet.</p>
                </div>
             )}
          </CardContent>
        </Card>
        <div className="col-span-4 lg:col-span-3 grid auto-rows-min gap-4">
            <Card>
                 <CardHeader>
                    <CardTitle className="font-headline flex items-center justify-between">Daily Reward</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Claim your daily VSD-lite credits just for being an active member of the VNDR community.</p>
                    <Button className="w-full" onClick={handleClaimTokens} disabled={!canClaimTokens}>
                        <HandCoins className="mr-2 h-4 w-4" />
                        {canClaimTokens ? "Claim 5 VSD-lite" : "Daily Credits Claimed"}
                    </Button>
                </CardContent>
            </Card>
             <Card>
                 <CardHeader>
                    <CardTitle className="font-headline flex items-center justify-between">Knowledgebase</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Have questions? Our AI-powered knowledgebase can help you with publishing, licensing, and more.</p>
                    <Button className="w-full" variant="secondary" asChild>
                        <Link href="/dashboard/knowledgebase">
                            Ask Symbi
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
