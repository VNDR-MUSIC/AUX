
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSafeCollection } from '@/hooks/use-safe-collection';
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
  const searchParams = useSearchParams();
  
  // Use the new, secure hook. Fetches all 'works' as it's a public catalog.
  // The server-side logic for filtering by owner is bypassed for public views if no user is passed,
  // but let's assume for a public catalog we might need a different approach.
  // For now, this will fetch ALL works if an admin is logged in, or an empty array for non-admins
  // which isn't ideal for a public page, but it's secure.
  // A better public catalog would use a dedicated, non-secure endpoint or a different rule.
  // Let's make it fetch all works regardless of user for now by adjusting the API.
  const { data: works, isLoading } = useSafeCollection<Track>('works');

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useOnboarding('catalog');

  const genres = useMemo(() => {
    if (!works) return [];
    const allGenres = works.map(work => work.genre).filter(Boolean);
    return ['All', ...Array.from(new Set(allGenres))];
  }, [works]);

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam !== null) {
      setSearchTerm(queryParam);
    }
  }, [searchParams]);

  const filteredWorks = useMemo(() => {
    return works
      ?.filter(work => {
        const term = searchTerm.toLowerCase();
        const artistName = work.artistName || '';
        return (
          (work.title && work.title.toLowerCase().includes(term)) ||
          (artistName.toLowerCase().includes(term))
        );
      })
      .filter(work => {
        return selectedGenre === 'All' || work.genre === selectedGenre;
      }) as Track[] | undefined;
  }, [works, searchTerm, selectedGenre]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Music Catalog</h1>
        <p className="mt-2 text-muted-foreground">Discover new music from the VNDR community.</p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-card">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search all works..."
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
            <p>No music found that matches your criteria.</p>
        </div>
      )}

    </div>
  );
}
