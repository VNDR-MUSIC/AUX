'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
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

const SECURED_COLLECTIONS: Record<string, string> = {
    'works': 'artistId',
    'vsd_transactions': 'userId',
    'license_requests': 'artistId',
};


/**
 * A hook to securely subscribe to a Firestore collection in real-time.
 * It automatically applies security filters based on the user's role (admin vs. regular user)
 * for collections defined in `SECURED_COLLECTIONS`.
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN.
 * Use useMemoFirebase to memoize it.
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} originalQuery -
 * The original Firestore CollectionReference or Query. Hook execution waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
  originalQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & { __memo?: boolean }) | null | undefined
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
    if (!originalQuery || !firestore || !user) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let finalQuery: Query<DocumentData> = originalQuery;
    const collectionPath = (originalQuery as any)._query.path.segments.join('/');
    const ownerField = SECURED_COLLECTIONS[collectionPath];

    // If it's a secured collection and the user is NOT an admin, apply the security filter.
    if (ownerField && !isAdmin) {
        finalQuery = query(originalQuery, where(ownerField, '==', user.uid));
    }

    setIsLoading(true);
    setError(null);

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
          path: (finalQuery as any)._query.path.segments.join('/'),
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);

        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [originalQuery, firestore, user, isAdmin]);

  if (originalQuery && !originalQuery.__memo) {
    throw new Error('A Firestore query was not properly memoized using useMemoFirebase. This will cause infinite loops.');
  }

  return { data, isLoading, error };
}
