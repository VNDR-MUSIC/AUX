'use client';

import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Link as LinkIcon, HardHat } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function AdminContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Management</CardTitle>
        <CardDescription>Tools for platform oversight and data management.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
            <HardHat className="h-4 w-4" />
            <AlertTitle>Admin Features Under Development</AlertTitle>
            <AlertDescription>
                A secure, paginated backend for administrators to manage users and works is currently under development. For now, you can access the subsidiary integration panel.
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
