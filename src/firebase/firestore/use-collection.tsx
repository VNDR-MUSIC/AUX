'use client';

import { useState, useEffect } from 'react';
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

const SECURED_COLLECTIONS: Record<string, string> = {
  works: 'artistId',
  vsd_transactions: 'userId',
  license_requests: 'artistId',
};

export function useCollection<T = any>(
  collectionPath: string | null,
  queryBuilder?: ((q: Query) => Query) | null
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const { user } = useUser();
  const { firestore } = useFirebase();
  const isAdmin = (user as any)?.customClaims?.admin === true;

  useEffect(() => {
    if (!firestore || !user || !collectionPath) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    let finalQuery: Query<DocumentData> = collection(firestore, collectionPath);
    const ownerField = SECURED_COLLECTIONS[collectionPath];

    if (ownerField && !isAdmin) {
      // This is the definitive workaround. If a query is for a secured collection,
      // it MUST be built with the user ID filter.
      // This is now handled by the queryBuilder passed from the component.
      // If no queryBuilder is passed for a secured collection, we block it client-side.
      if (!queryBuilder) {
        console.warn(
            `[useCollection] Blocked insecure query on "${collectionPath}". Non-admins must provide a query filtered by user ID.`
        );
        setData([]); // Return empty array to prevent crashes
        setIsLoading(false);
        return;
      }
      finalQuery = query(finalQuery, where(ownerField, '==', user.uid));
    }

    if (queryBuilder) {
      // Allow components to add their own constraints (like orderBy)
      // The security `where` clause is applied first if needed.
      finalQuery = queryBuilder(finalQuery);
    }

    const unsubscribe = onSnapshot(
      finalQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = snapshot.docs.map(doc => ({
          ...(doc.data() as T),
          id: doc.id,
        }));
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
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
  }, [collectionPath, firestore, user, isAdmin, queryBuilder]);

  return { data, isLoading, error };
}
