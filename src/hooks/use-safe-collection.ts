
'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';

export function useSafeCollection<T>(collectionPath: string | null) {
  const { user } = useUser();
  const auth = useAuth(); // We might not need auth here if user object is sufficient
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // We must have a user and a collection path to proceed.
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
            body: JSON.stringify({ collectionPath }),
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
  }, [collectionPath, user]); // Removed auth from dependency array as `user` covers the auth state change

  return { data, isLoading, error };
}
