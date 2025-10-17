
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
  // safeServerAction will handle serialization and error catching
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

    // Publicly viewable 'works' collection (e.g., for the main catalog page)
    if (collectionPath === 'works' && !filters?.artistId && !idToken) {
      const publicWorksSnap = await db.collection(collectionPath).get();
      return publicWorksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // All other requests require a user to be authenticated
    if (!uid) {
        return [];
    }
    
    let query: CollectionReference<DocumentData> | FirebaseFirestore.Query<DocumentData> = db.collection(collectionPath);
    
    // Non-admins have specific rules applied
    if (!isAdmin) {
        if (collectionPath === 'license_requests') {
             // Users can see requests they've made OR requests for their tracks
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
            // Users can only view their own works unless it's a public query
            if (filters?.artistId && filters.artistId !== uid) {
                // This will be caught by safeServerAction
                throw new Error("Permission denied: You can only view your own works.");
            }
            query = query.where('artistId', '==', uid);

        } else if (collectionPath === 'vsd_transactions') {
            // Users can only view their own transactions
            query = query.where('userId', '==', uid);
        }
    }
    
    // Apply any additional filters passed from the client
    if (filters) {
      for (const key in filters) {
        // Skip artistId filter for non-admins as it's already applied
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
