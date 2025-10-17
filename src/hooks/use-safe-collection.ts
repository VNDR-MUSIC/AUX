
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

    // For public paths, don't wait for user loading to finish.
    const isPublicPath = collectionPath === 'works' && !filters;
    if (!isPublicPath && isUserLoading) {
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Server action now returns a Response object, which we need to parse.
    const response = await fetchCollectionAction({ collectionPath, filters });
    const result = await response.json();

    if (result.success) {
      setData(result.data as T[]);
    } else {
      console.error(`🔥 useSafeCollection Error on '${collectionPath}':`, result.details);
      setError(result.error || "An unexpected error occurred.");
      setData(null);
    }
    
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionPath, user, isUserLoading, JSON.stringify(filters)]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  return { data, isLoading, error, refetch: fetchDocs };
}
