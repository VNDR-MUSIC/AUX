
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ShieldX, Link as LinkIcon, HardHat } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function AdminContent() {
  // --- THIS CODE IS QUARANTINED ---
  // The following query attempts to fetch ALL works from the database.
  // This broad `list` query is blocked by Firestore security rules for all users,
  // including admins, unless a specific rule allowing `allow list: if isAdmin();`
  // is successfully deployed for the `works` collection. This query has been
  // a persistent source of "Missing or insufficient permissions" errors and is now disabled.
  //
  // const { firestore } = useFirebase();
  // const worksQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'works')) : null), [firestore]);
  // const { data: works, isLoading: areWorksLoading } = useCollection<Track>(worksQuery);
  // --- END QUARANTINED CODE ---

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Management</CardTitle>
        <CardDescription>View, search, and manage works on the platform.</CardDescription>
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
              disabled
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
               <Select value={selectedGenre} onValueChange={setSelectedGenre} disabled>
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by genre" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                  </SelectContent>
              </Select>
          </div>
        </div>
        
        <Alert variant="destructive">
            <HardHat className="h-4 w-4" />
            <AlertTitle>Work Management Disabled</AlertTitle>
            <AlertDescription>
                This section has been temporarily disabled due to recurring Firestore permission errors. The code was attempting to fetch all works from all users, which is blocked by security rules. To fix this, a specific security rule allowing admins to perform `list` operations on the 'works' collection must be implemented and deployed.
            </AlertDescription>
        </Alert>
        
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
