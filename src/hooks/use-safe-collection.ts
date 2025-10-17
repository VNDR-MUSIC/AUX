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
    if (!user || !collectionPath) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const fetchDocs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/fetchCollection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            // Pass filters in the body
            body: JSON.stringify({ collectionPath, filters }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch data with status: ${response.status}`);
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
