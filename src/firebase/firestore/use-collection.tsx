'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useFirebase, useUser } from '../provider';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

// Maps secured collection paths to the field that must be filtered by user ID.
const SECURED_COLLECTIONS: Record<string, string> = {
  works: 'artistId',
  vsd_transactions: 'userId',
  license_requests: 'artistId',
};

export function useCollection<T = DocumentData>(
  collectionPath: string | null,
  queryBuilder?: ((q: Query) => Query) | null
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  
  const { firestore } = useFirebase();
  const { user } = useUser();
  const isAdmin = (user as any)?.customClaims?.admin === true;

  const finalQuery = useMemo(() => {
    if (!firestore || !user || !collectionPath) {
      return null;
    }

    let q: Query = collection(firestore, collectionPath);
    const ownerField = SECURED_COLLECTIONS[collectionPath];

    // Apply security filter if the collection is secured and the user is not an admin
    if (ownerField && !isAdmin) {
      q = query(q, where(ownerField, '==', user.uid));
    }

    // Apply any additional query constraints from the component
    if (queryBuilder) {
      q = queryBuilder(q);
    }
    
    return q;
  }, [collectionPath, firestore, user, isAdmin, queryBuilder]);

  useEffect(() => {
    if (!finalQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      finalQuery,
      (snapshot: QuerySnapshot) => {
        const results = snapshot.docs.map(doc => ({
          ...(doc.data() as T),
          id: doc.id,
        }));
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
        if (!collectionPath) return; // Should not happen if finalQuery exists
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path: collectionPath,
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);

        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [finalQuery, collectionPath]);

  return { data, isLoading, error };
}
