
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useDoc, useUser, useMemoFirebase } from '@/firebase';
import { useSafeCollection } from '@/hooks/use-safe-collection';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import TrackCard from '@/components/catalog/track-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Mail, User as UserIcon, Trash2, Edit } from 'lucide-react';
import { deleteTrackAction } from '@/app/actions/music';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMemo } from 'react';
import { Track } from '@/store/music-player-store';

export default function ProfilePage() {
  const { userId } = useParams();
  const { firestore } = useFirebase();
  const { user: currentUser } = useUser();
  const { toast } = useToast();

  const userRef = useMemo(
    () => (firestore && userId ? doc(firestore, 'users', userId as string) : null),
    [firestore, userId]
  );
  const { data: user, isLoading: isUserLoading } = useDoc(userRef);

  // Use the new, secure hook. We pass the artistId as a filter.
  const { data: works, isLoading: areWorksLoading } = useSafeCollection<Track>(
    'works',
    { artistId: userId as string }
  );
  
  const adminRef = useMemo(() => (firestore && currentUser ? doc(firestore, `roles_admin/${currentUser.uid}`) : null), [firestore, currentUser]);
  const { data: adminDoc } = useDoc(adminRef);
  const isAdmin = !!adminDoc;

  const profileHeaderImage = PlaceHolderImages.find(p => p.id === 'hero-4');
  const userAvatarImage = PlaceHolderImages.find(p => p.id === 'user-avatar-1');
  const isOwnProfile = currentUser?.uid === userId;
  const canModerate = isOwnProfile || isAdmin;

  const handleDeleteTrack = async (trackId: string) => {
    if (!canModerate) return;
    const result = await deleteTrackAction(trackId, userId as string);
     toast({
      title: result.error ? 'Error' : 'Success',
      description: result.error || result.message,
      variant: result.error ? 'destructive' : 'default',
    });
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="flex items-end gap-4 -mt-12 ml-8 z-10 relative">
          <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
          <Skeleton className="h-8 w-48 mb-4" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full" />
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
              <a href="/dashboard/settings"><Edit className="mr-2 h-4 w-4" /> Edit Profile</a>
            </Button>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-headline text-2xl font-bold mb-6">Music Catalog ({works?.length || 0})</h2>
        {areWorksLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-square w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        ) : works && works.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {works.map(work => (
              <div key={work.id} className="relative group">
                <TrackCard track={work as any} playlist={works as any} />
                 {canModerate && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the work
                          &quot;{work.title}&quot; and remove its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTrack(work.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
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
