
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useDoc, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import TrackCard from '@/components/catalog/track-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Mail, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { userId } = useParams();
  const { firestore } = useFirebase();
  const { user: currentUser } = useUser();

  const userRef = useMemoFirebase(
    () => (firestore && userId ? doc(firestore, 'users', userId as string) : null),
    [firestore, userId]
  );
  const { data: user, isLoading: isUserLoading } = useDoc(userRef);

  const tracksQuery = useMemoFirebase(
    () =>
      firestore && userId
        ? query(collection(firestore, 'tracks'), where('artistId', '==', userId))
        : null,
    [firestore, userId]
  );
  const { data: tracks, isLoading: areTracksLoading } = useCollection(tracksQuery);

  const profileHeaderImage = PlaceHolderImages.find(p => p.id === 'hero-4');
  const userAvatarImage = PlaceHolderImages.find(p => p.id === 'user-avatar-1');
  const isOwnProfile = currentUser?.uid === userId;

  if (isUserLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="flex items-end gap-4 -mt-12 ml-8 z-10 relative">
          <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
          <Skeleton className="h-8 w-48 mb-4" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-16">User not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="relative mb-8">
        <div className="relative h-48 w-full rounded-lg overflow-hidden">
          {profileHeaderImage && (
            <Image
              src={profileHeaderImage.imageUrl}
              alt="Profile header"
              fill
              className="object-cover"
              data-ai-hint={profileHeaderImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 ml-4 sm:ml-8 z-10 relative">
          <Avatar className="h-24 w-24 border-4 border-background text-6xl">
            {userAvatarImage ? <AvatarImage src={userAvatarImage.imageUrl} alt={user.username} /> : null }
            <AvatarFallback>
                <UserIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 py-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">{user.username}</h1>
            {user.email && <p className="text-muted-foreground flex items-center gap-2 mt-1"><Mail className="h-4 w-4" /> {user.email}</p>}
          </div>
          {isOwnProfile && (
            <Button asChild variant="outline">
              <a href="/dashboard/settings">Edit Profile</a>
            </Button>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-headline text-2xl font-bold mb-6">Music Catalog ({tracks?.length || 0})</h2>
        {areTracksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        ) : tracks && tracks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tracks.map(track => (
              <TrackCard key={track.id} track={track as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground bg-card rounded-lg">
            <p>{user.username} hasn't uploaded any music yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
