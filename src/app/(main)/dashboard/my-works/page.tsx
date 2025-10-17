
'use client';

import { useUser, useCollection, useMemoFirebase } from '@/firebase';
import { useFirebase } from '@/firebase/provider';
import { collection, query, orderBy } from 'firebase/firestore';
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
import { MoreHorizontal, Music, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Track } from '@/store/music-player-store';

type Work = Track & {
  status?: string;
  musoCreditsFetched?: boolean;
  audioFeatures?: any;
};

export default function MyWorksPage() {
  const { user } = useUser();
  const { firestore } = useFirebase();

  // The useCollection hook now automatically applies the where('artistId', '==', user.uid) filter.
  // We only need to specify the collection and ordering.
  const worksQuery = useMemoFirebase(
    () =>
      firestore && user?.uid
        ? query(
            collection(firestore, 'works'),
            orderBy('uploadDate', 'desc')
          )
        : null,
    [firestore, user?.uid]
  );

  const { data: works, isLoading } = useCollection<Work>(worksQuery);

  const getStatusBadge = (work: Work) => {
    if (work.status === 'processing') {
      return <Badge variant="secondary">Processing</Badge>;
    }
    // Considered "Published" if both Muso and Audio features are done (simulated)
    if (work.musoCreditsFetched && work.audioFeatures) {
      return <Badge className="bg-green-600 hover:bg-green-700">Published</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
            My Works
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your uploaded music, view analytics, and track licensing.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/upload">
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload New Work
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Catalog</CardTitle>
          <CardDescription>
            A complete list of all the music you have uploaded to VNDR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : works && works.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Genre</TableHead>
                  <TableHead className="hidden md:table-cell text-center">
                    Plays
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {works.map((work) => (
                  <TableRow key={work.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={work.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={work.coverArtUrl || '/placeholder.svg'}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{work.title}</TableCell>
                    <TableCell>{getStatusBadge(work)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {work.genre}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      {work.plays || 0}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Analytics</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Music className="mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-medium">
                Your catalog is empty
              </h3>
              <p className="mt-1 text-sm">
                Upload your first work to get started.
              </p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/dashboard/upload">Upload Work</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
