
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, DocumentData } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ShieldX, Link as LinkIcon, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Track } from '@/store/music-player-store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function AdminContent() {
  const { firestore, user } = useFirebase();

  // Data fetching - NOW QUERIES ONLY FOR THE ADMIN'S OWN WORKS
  const worksQuery = useMemoFirebase(() => (firestore && user ? query(collection(firestore, 'works'), where('artistId', '==', user.uid)) : null), [firestore, user]);
  const { data: works, isLoading: areWorksLoading } = useCollection<Track>(worksQuery);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const genres = useMemo(() => {
    if (!works) return [];
    const allGenres = works.map(track => track.genre).filter(Boolean) as string[];
    return ['all', ...Array.from(new Set(allGenres))];
  }, [works]);

  const filteredWorks = useMemo(() => {
    return works
      ?.filter(track => {
        const term = searchTerm.toLowerCase();
        return (
          (track.title && track.title.toLowerCase().includes(term)) ||
          (track.artistName && track.artistName.toLowerCase().includes(term))
        );
      })
      .filter(track => {
        return selectedGenre === 'all' || track.genre === selectedGenre;
      });
  }, [works, searchTerm, selectedGenre]);

  if (areWorksLoading) {
    return (
       <Card>
        <CardHeader>
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-full sm:w-48" />
            </div>
            <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Management</CardTitle>
        <CardDescription>View, search, and manage works on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Admin View</AlertTitle>
            <AlertDescription>
                For security and stability, this view currently shows works uploaded by the Admin account.
            </AlertDescription>
        </Alert>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 p-4 border rounded-lg bg-card">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or artist..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
               <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by genre" />
                  </SelectTrigger>
                  <SelectContent>
                      {genres.map(genre => (
                          <SelectItem key={genre} value={genre} className="capitalize">{genre}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
        </div>
        
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="text-center">Plays</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorks && filteredWorks.length > 0 ? (
                filteredWorks.map(work => (
                  <TableRow key={work.id}>
                    <TableCell className="font-medium">{work.title}</TableCell>
                    <TableCell>{work.artistName}</TableCell>
                    <TableCell>{work.genre}</TableCell>
                    <TableCell className="text-center">
                      {work.plays || 0}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No works found for this user.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { firestore } = useFirebase();

  // Admin role check
  const adminRef = useMemoFirebase(() => (firestore && user ? doc(firestore, `roles_admin/${user.uid}`) : null), [firestore, user]);
  const { data: adminDoc, isLoading: isAdminLoading } = useDoc(adminRef);
  const isAdmin = !!adminDoc;
  
  const isLoading = isAuthLoading || isAdminLoading;

  if (isLoading) {
      return (
        <div className="container mx-auto py-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-96 w-full" />
        </div>
      )
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter md:text-5xl">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Platform oversight and data management.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/subsidiaries">
            <LinkIcon className="mr-2 h-4 w-4" />
            Subsidiary Integration
          </Link>
        </Button>
      </div>

      <AdminContent />
    </div>
  );
}
