
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import type { User } from 'firebase/auth';
import { Track } from '@/store/music-player-store';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentWorksProps {
  user: User | null;
  isLoading: boolean;
}

export default function RecentWorks({ user, isLoading: isParentLoading }: RecentWorksProps) {
  const { firestore } = useFirebase();

  const worksQuery = useMemoFirebase(
    () =>
      firestore && user
        ? query(
            collection(firestore, 'works'),
            where('artistId', '==', user.uid),
            orderBy('uploadDate', 'desc'),
            limit(5)
          )
        : null,
    [firestore, user]
  );
  const { data: recentWorks, isLoading: areWorksLoading } = useCollection<Track>(worksQuery);
  const isLoading = isParentLoading || areWorksLoading;

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Works</CardTitle>
          <CardDescription>
            Your 5 most recently uploaded works.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/dashboard/my-works">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : recentWorks && recentWorks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Genre</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
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
                  <TableCell className="hidden sm:table-cell">
                    {work.genre}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{(work as any).status || 'Pending'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{work.plays || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>You haven't uploaded any works yet.</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard/upload">Upload Work</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
