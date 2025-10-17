
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

    // Public access for 'works' collection without user-specific filters
    if (collectionPath === 'works' && !filters?.artistId && !idToken) {
      const publicWorksSnap = await db.collection(collectionPath).get();
      return publicWorksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Authenticated access is required for anything else
    if (!uid) {
        // Not an error, just means no user is logged in for a protected route.
        // Return empty array as the data.
        return [];
    }
    
    let query: CollectionReference<DocumentData> | FirebaseFirestore.Query<DocumentData> = db.collection(collectionPath);
    
    // Apply security rules logic server-side
    if (!isAdmin) {
        if (collectionPath === 'license_requests') {
             // For license requests, fetch based on artist OR requestor
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
            // For works, you can only query your own unless you are an admin.
            // If an artistId filter is provided, it must match the current user's ID.
            if (filters?.artistId && filters.artistId !== uid) {
                throw new Error("Permission denied: You can only view your own works.");
            }
            query = query.where('artistId', '==', uid);

        } else if (collectionPath === 'vsd_transactions') {
            // For vsd_transactions, filter by userId
            query = query.where('userId', '==', uid);
        }
    }
    
    // Apply additional filters from the client if they exist, but only if user is admin
    // or the filter doesn't conflict with security rules.
    if (filters) {
      for (const key in filters) {
        // Skip artistId filter for 'works' since it's already applied for non-admins
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
