
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirebase, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, DocumentData } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import TrackCard from '@/components/catalog/track-card';
import { Track } from '@/store/music-player-store';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useSearchParams } from 'next/navigation';

export default function CatalogPage() {
  const { firestore, user } = useFirebase(); // Get user from useFirebase
  const searchParams = useSearchParams();
  
  // This query now fetches only the works of the currently logged-in user.
  const worksQuery = useMemoFirebase(() => 
    firestore && user 
      ? query(collection(firestore, 'works'), where('artistId', '==', user.uid)) 
      : null, 
  [firestore, user]);
  
  const { data: works, isLoading } = useCollection<DocumentData>(worksQuery);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useOnboarding('catalog');

  const genres = useMemo(() => {
    if (!works) return [];
    const allGenres = works.map(work => work.genre).filter(Boolean);
    return ['All', ...Array.from(new Set(allGenres))];
  }, [works]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const filteredWorks = useMemo(() => {
    return works
      ?.filter(work => {
        const term = searchTerm.toLowerCase();
        return (
          (work.title && work.title.toLowerCase().includes(term)) ||
          (work.artistName && work.artistName.toLowerCase().includes(term))
        );
      })
      .filter(work => {
        return selectedGenre === 'All' || work.genre === selectedGenre;
      }) as Track[] | undefined;
  }, [works, searchTerm, selectedGenre]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Your Music</h1>
        <p className="mt-2 text-muted-foreground">Browse and manage music you have uploaded.</p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-card">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your works..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
      </div>
      
      {isLoading ? (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredWorks?.map(work => (
            <TrackCard key={work.id} track={work} playlist={filteredWorks} />
          ))}
        </div>
      )}

      {!isLoading && filteredWorks?.length === 0 && (
         <div className="text-center py-16 text-muted-foreground">
            <p>You haven't uploaded any music that matches your criteria.</p>
        </div>
      )}

    </div>
  );
}
