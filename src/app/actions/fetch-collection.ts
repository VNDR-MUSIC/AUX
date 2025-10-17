
'use server';

import { getFirebaseAdmin } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { CollectionReference, DocumentData, Timestamp } from 'firebase-admin/firestore';
import { safeServerAction } from './safe-action';

/**
 * Recursively serialize Firestore data to JSON-safe values.
 * This is a private helper function and not exported.
 * Converts Timestamp -> ISO string, handles arrays and nested objects.
 */
function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }
  if (data instanceof Timestamp) return data.toDate().toISOString();
  if (Array.isArray(data)) return data.map(serializeFirestoreData);
  
  const serialized: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      serialized[key] = serializeFirestoreData(data[key]);
    }
  }
  return serialized;
}

export async function fetchCollectionAction({
  collectionPath,
  filters,
}: {
  collectionPath: string;
  filters?: Record<string, any>;
}) {
  const result = await safeServerAction(async () => {
    const cookieStore = cookies();
    const idToken = cookieStore.get('firebaseIdToken')?.value;
    const { db, auth: adminAuth } = await getFirebaseAdmin();
    
    let decodedToken;
    let uid;
    let isAdmin = false;

    if (idToken) {
        decodedToken = await adminAuth.verifyIdToken(idToken);
        uid = decodedToken.uid;
        isAdmin = decodedToken.admin === true;
    }

    if (collectionPath === 'works' && !filters?.artistId && !idToken) {
      const publicWorksSnap = await db.collection(collectionPath).get();
      const data = publicWorksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return serializeFirestoreData(data);
    }

    if (!uid) {
        return serializeFirestoreData([]);
    }
    
    let query: CollectionReference<DocumentData> | FirebaseFirestore.Query<DocumentData> = db.collection(collectionPath);
    
    if (!isAdmin) {
        if (collectionPath === 'license_requests') {
             const artistQuery = query.where('artistId', '==', uid);
             const requestorQuery = query.where('requestorId', '==', uid);

             const [artistSnap, requestorSnap] = await Promise.all([
                 artistQuery.get(),
                 requestorQuery.get()
             ]);

             const requestsById = new Map();
             artistSnap.docs.forEach(doc => requestsById.set(doc.id, { id: doc.id, ...doc.data() }));
             requestorSnap.docs.forEach(doc => requestsById.set(doc.id, { id: doc.id, ...doc.data() }));
             
             const data = Array.from(requestsById.values());
             return serializeFirestoreData(data);

        } else if (collectionPath === 'works') {
            if (filters?.artistId && filters.artistId !== uid) {
                throw new Error("Permission denied: You can only view your own works.");
            }
            query = query.where('artistId', '==', uid);

        } else if (collectionPath === 'vsd_transactions') {
            query = query.where('userId', '==', uid);
        }
    }
    
    if (filters) {
      for (const key in filters) {
        if (collectionPath === 'works' && key === 'artistId' && !isAdmin) continue;
        
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          if (filters[key] === null || filters[key] === undefined) continue;
          query = query.where(key, '==', filters[key]);
        }
      }
    }

    const snap = await query.get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return serializeFirestoreData(data);
  });

  return result;
}
