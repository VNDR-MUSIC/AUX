
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

// The hook now accepts an optional filters object.
export function useSafeCollection<T>(collectionPath: string | null, filters?: Record<string, any>) {
  const { user } = useUser();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Do not fetch if the path is null (e.g. waiting for dependencies)
    if (!collectionPath) {
      setData([]);
      setIsLoading(false);
      return;
    }

    // For public collections that don't need a user, we can fetch immediately.
    // For protected collections, we must wait for the user object.
    const isPublicPath = collectionPath === 'works' && !filters;
    if (!isPublicPath && !user) {
      // If it's a protected path and we don't have a user, wait.
      // If data is already there from a previous user, clear it.
      if (data.length > 0) setData([]);
      setIsLoading(true); // Remain in loading state until user is available
      return;
    }

    const fetchDocs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const idToken = user ? await user.getIdToken() : null;
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
        }
        
        const response = await fetch('/api/fetchCollection', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ collectionPath, filters }),
        });

        if (!response.ok) {
            try {
              // Try to parse the error response as JSON.
              const errorData = await response.json();
              throw new Error(errorData.error || `Server responded with status: ${response.status}`);
            } catch (e) {
              // If parsing fails, it's not a JSON response (e.g., HTML error page).
              throw new Error(`An unexpected response was received from the server.`);
            }
        }

        const result = await response.json();
        setData(result as T[]);
      } catch (err) {
        setError(err);
        console.error(`Error fetching collection '${collectionPath}':`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  // Pass filters as a dependency. Use JSON.stringify for stable dependency checking.
  }, [collectionPath, user, JSON.stringify(filters)]);

  return { data, isLoading, error };
}
