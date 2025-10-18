
'use client';

import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Link as LinkIcon, HardHat, Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMemo } from 'react';

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
  
  // Directly use the property attached in the Firebase provider
  const isAdmin = (user as any)?.admin === true;
  const isSuperAdmin = user?.email === 'support@vndrmusic.com';
  
  const isLoading = isAuthLoading;

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
          <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter md:text-5xl flex items-center gap-3">
             {isSuperAdmin && <Crown className="text-yellow-400 h-8 w-8" />}
             {isSuperAdmin ? 'Super Admin' : 'Admin'} Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isSuperAdmin ? 'Full control over the VNDR Music ecosystem.' : 'Platform oversight and data management.'}
          </p>
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
