
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { fetchCollectionAction } from '@/app/actions/fetch-collection';

// The hook now accepts an optional filters object.
export function useSafeCollection<T>(collectionPath: string | null, filters?: Record<string, any>) {
  const { user, isUserLoading } = useUser();
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Do not fetch if the path is null (e.g. waiting for dependencies)
    if (!collectionPath) {
      setData(null);
      setIsLoading(false);
      return;
    }

    // For public collections that don't need a user, we can fetch immediately.
    // For protected collections, we must wait for the user object to be loaded.
    const isPublicPath = collectionPath === 'works' && !filters;
    if (!isPublicPath && isUserLoading) {
      // If it's a protected path and we are still checking the user, wait.
      // Don't clear data, to avoid flashes of empty content on re-renders.
      setIsLoading(true);
      return;
    }

    const fetchDocs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchCollectionAction({ collectionPath, filters });
        
        if (result.error) {
            // The server action now returns a structured error
            throw new Error(result.details || result.error);
        }

        setData(result.data as T[]);
      } catch (err: any) {
        console.error(`🔥 useSafeCollection Error on '${collectionPath}':`, err);
        setError(err.message || "An unexpected error occurred.");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  // Pass filters as a dependency. Use JSON.stringify for stable dependency checking.
  // also depends on isUserLoading to re-trigger fetch after auth state is resolved.
  }, [collectionPath, user, isUserLoading, JSON.stringify(filters)]);

  return { data, isLoading, error };
}
