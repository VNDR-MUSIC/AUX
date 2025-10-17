
'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';

export function useSafeCollection<T>(collectionPath: string | null) {
  const { user } = useUser();
  const auth = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!user || !auth || !collectionPath) {
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
            body: JSON.stringify({ collectionPath }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch data');
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
  }, [collectionPath, user, auth]);

  return { data, isLoading, error };
}
