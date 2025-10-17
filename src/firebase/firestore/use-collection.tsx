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

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean; // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

// Maps collection names to the field that stores the owner's ID.
const SECURED_COLLECTIONS: Record<string, string> = {
    works: 'artistId',
    vsd_transactions: 'userId',
    license_requests: 'artistId',
};

/**
 * A hook to securely subscribe to a Firestore collection in real-time.
 * It automatically applies security filters based on the user's role (admin vs. regular user)
 * for collections defined in `SECURED_COLLECTIONS`.
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {string | null} collectionPath - The path to the Firestore collection (e.g., 'works').
 * @param {((q: Query) => Query) | null} [queryBuilder] - An optional function to add more query constraints (e.g., orderBy, limit).
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
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
    // Wait until all dependencies are available.
    if (!firestore || !user || !collectionPath) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Start with the base collection reference.
    let finalQuery: Query<DocumentData> = collection(firestore, collectionPath);

    const ownerField = SECURED_COLLECTIONS[collectionPath];

    // If it's a secured collection and the user is NOT an admin, apply the security filter.
    if (ownerField && !isAdmin) {
        finalQuery = query(finalQuery, where(ownerField, '==', user.uid));
    }
    
    // Apply any additional query constraints provided by the caller.
    if (queryBuilder) {
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
  }, [collectionPath, firestore, user, isAdmin, queryBuilder]); // `queryBuilder` should be stable (memoized) if it's not a static function.

  return { data, isLoading, error };
}
