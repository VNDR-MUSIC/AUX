'use server';

import { getFirebaseAdmin } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { safeServerAction } from './safe-action';

export async function fetchCollectionAction({
  collectionPath,
  filters,
}: {
  collectionPath: string;
  filters?: Record<string, any>;
}) {
  // Wrap the entire logic in the safe server action
  return safeServerAction(async () => {
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

    // Handle public 'works' collection fetch
    if (collectionPath === 'works' && !filters?.artistId && !idToken) {
      const publicWorksSnap = await db.collection(collectionPath).get();
      return publicWorksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // If not a public fetch and no user is logged in, return empty.
    if (!uid) {
        return [];
    }
    
    let query: CollectionReference<DocumentData> | FirebaseFirestore.Query<DocumentData> = db.collection(collectionPath);
    
    // Apply user-based security filters if the user is not an admin
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
             
             return Array.from(requestsById.values());

        } else if (collectionPath === 'works') {
            // Non-admins can only query their own works.
            if (filters?.artistId && filters.artistId !== uid) {
                throw new Error("Permission denied: You can only view your own works.");
            }
            query = query.where('artistId', '==', uid);

        } else if (collectionPath === 'vsd_transactions') {
            query = query.where('userId', '==', uid);
        }
    }
    
    // Apply any additional developer-provided filters
    if (filters) {
      for (const key in filters) {
        // This prevents redundantly applying the artistId filter for non-admins on the 'works' collection.
        if (collectionPath === 'works' && key === 'artistId' && !isAdmin) continue;
        
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          if (filters[key] === null || filters[key] === undefined) continue;
          query = query.where(key, '==', filters[key]);
        }
      }
    }

    const snap = await query.get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
}