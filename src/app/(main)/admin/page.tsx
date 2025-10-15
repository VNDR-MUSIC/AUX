
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, DocumentData } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { user } = useUser();
  const { firestore } = useFirebase();

  // Admin role check
  const adminRef = useMemoFirebase(() => (firestore && user ? doc(firestore, `roles_admin/${user.uid}`) : null), [firestore, user]);
  const { data: adminDoc, isLoading: isAdminLoading } = useDoc(adminRef);
  const isAdmin = !!adminDoc;

  // Data fetching
  const tracksQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'tracks') : null), [firestore]);
  const { data: tracks, isLoading: areTracksLoading } = useCollection<DocumentData>(tracksQuery);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const genres = useMemo(() => {
    if (!tracks) return [];
    const allGenres = tracks.map(track => track.genre).filter(Boolean);
    return ['all', ...Array.from(new Set(allGenres))];
  }, [tracks]);

  const filteredTracks = useMemo(() => {
    return tracks
      ?.filter(track => {
        const term = searchTerm.toLowerCase();
        return (
          (track.title && track.title.toLowerCase().includes(term)) ||
          (track.artistName && track.artistName.toLowerCase().includes(term))
        );
      })
      .filter(track => {
        if (selectedStatus === 'all') return true;
        return selectedStatus === 'verified' ? track.musoVerified : !track.musoVerified;
      })
      .filter(track => {
        return selectedGenre === 'all' || track.genre === selectedGenre;
      });
  }, [tracks, searchTerm, selectedStatus, selectedGenre]);
  
  const isLoading = isAdminLoading || areTracksLoading;

  if (isLoading) {
      return (
        <div className="container mx-auto py-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
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
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Platform oversight and data management.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Muso.AI Track Management</CardTitle>
          <CardDescription>View, search, and filter all tracks on the platform and their verification status.</CardDescription>
        </CardHeader>
        <CardContent>
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
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="not_verified">Not Verified</SelectItem>
                    </SelectContent>
                </Select>
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
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Track</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead className="text-center">Muso.AI Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTracks && filteredTracks.length > 0 ? (
                  filteredTracks.map(track => (
                    <TableRow key={track.id}>
                      <TableCell className="font-medium">{track.title}</TableCell>
                      <TableCell>{track.artistName}</TableCell>
                      <TableCell>{track.genre}</TableCell>
                      <TableCell className="text-center">
                        {track.musoVerified ? (
                          <Badge variant="default" className="bg-green-600">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Not Verified</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No tracks found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
