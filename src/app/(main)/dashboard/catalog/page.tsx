
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, DocumentData } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import TrackCard from '@/components/catalog/track-card';
import { Track } from '@/store/music-player-store';
import { useOnboarding } from '@/hooks/use-onboarding';

const genres = ["Synthwave", "Lofi Hip-Hop", "Future Funk", "Ambient", "Electronic", "All"];

export default function CatalogPage() {
  const { firestore } = useFirebase();
  const tracksQuery = useMemoFirebase(() => firestore ? collection(firestore, 'tracks') : null, [firestore]);
  const { data: tracks, isLoading } = useCollection<DocumentData>(tracksQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showLicensedOnly, setShowLicensedOnly] = useState(false);

  useOnboarding('catalog');

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
        return selectedGenre === 'All' || track.genre === selectedGenre;
      })
      .filter(track => {
        return !showLicensedOnly || (track.price && track.price > 0);
      }) as Track[] | undefined;
  }, [tracks, searchTerm, selectedGenre, showLicensedOnly]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Music Catalog</h1>
        <p className="mt-2 text-muted-foreground">Discover and license music from independent artists.</p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-card">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or artist..."
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
            <div className="flex items-center space-x-2">
                <Checkbox id="licensed-only" checked={showLicensedOnly} onCheckedChange={(checked) => setShowLicensedOnly(Boolean(checked))} />
                <Label htmlFor="licensed-only" className="whitespace-nowrap">For License</Label>
            </div>
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
          {filteredTracks?.map(track => (
            <TrackCard key={track.id} track={track} playlist={filteredTracks} />
          ))}
        </div>
      )}

      {!isLoading && filteredTracks?.length === 0 && (
         <div className="text-center py-16 text-muted-foreground">
            <p>No tracks found that match your criteria.</p>
        </div>
      )}

    </div>
  );
}
