
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/firebase';
import { fetchCollectionAction } from '@/app/actions/fetch-collection';

export function useSafeCollection<T>(collectionPath: string | null, filters?: Record<string, any>) {
  const { user, isUserLoading } = useUser();
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    if (!collectionPath) {
      setData(null);
      setIsLoading(false);
      return;
    }

    // A public path doesn't need to wait for the user to load
    const isPublicPath = collectionPath === 'works' && !filters;
    if (!isPublicPath && isUserLoading) {
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // The action now returns a Next.js Response object
      const response = await fetchCollectionAction({ collectionPath, filters });
      
      // We must parse its JSON body to get our structured data
      const result = await response.json();

      if (result.success) {
        setData(result.data as T[]);
      } else {
        // Handle the structured error from safeServerAction
        console.error(`🔥 useSafeCollection Error on '${collectionPath}':`, result.error);
        setError(result.error || "An unexpected server error occurred.");
        setData(null);
      }
    } catch (e: any) {
        // This catches network errors or if response.json() fails
        console.error(`🔥 useSafeCollection Hard Fail on '${collectionPath}':`, e);
        setError("Failed to communicate with the server. Please check your network connection.");
        setData(null);
    } finally {
      setIsLoading(false);
    }
  // We stringify filters to ensure the useCallback hook properly detects changes in filter objects.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionPath, user, isUserLoading, JSON.stringify(filters)]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  return { data, isLoading, error, refetch: fetchDocs };
}
