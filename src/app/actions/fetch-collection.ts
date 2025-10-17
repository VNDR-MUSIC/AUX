
'use server';

import { getFirebaseAdmin } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { DocumentData, Query } from 'firebase-admin/firestore';
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
    if (collectionPath === 'works' && !filters?.artistId) {
       let publicQuery: Query<DocumentData> = db.collection(collectionPath);
       if (filters) {
          for (const key in filters) {
            if (Object.prototype.hasOwnProperty.call(filters, key)) {
                if (filters[key] === null || filters[key] === undefined) continue;
                publicQuery = publicQuery.where(key, '==', filters[key]);
            }
          }
       }
      const publicWorksSnap = await publicQuery.get();
      return publicWorksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // All other requests require a user to be authenticated
    if (!uid) {
        // Return empty array if user is not logged in for protected collections
        return [];
    }
    
    let query: Query<DocumentData> = db.collection(collectionPath);
    
    // Non-admins have specific rules applied
    if (!isAdmin) {
        if (collectionPath === 'license_requests') {
             // Users can see requests they've made OR requests for their tracks
             const artistQuery = db.collection(collectionPath).where('artistId', '==', uid);
             const requestorQuery = db.collection(collectionPath).where('requestorId', '==', uid);

             const [artistSnap, requestorSnap] = await Promise.all([
                 artistQuery.get(),
                 requestorQuery.get()
             ]);

             const requestsById = new Map();
             artistSnap.docs.forEach(doc => requestsById.set(doc.id, { id: doc.id, ...doc.data() }));
             requestorSnap.docs.forEach(doc => requestsById.set(doc.id, { id: doc.id, ...doc.data() }));
             
             return Array.from(requestsById.values());

        } else if (collectionPath === 'works') {
            // If filtering by artistId, it MUST be the current user's ID
            if (filters?.artistId && filters.artistId !== uid) {
                throw new Error("Permission denied: You can only view your own works.");
            }
            query = query.where('artistId', '==', uid);

        } else if (collectionPath === 'vsd_transactions') {
            // Users can only view their own transactions
            query = query.where('userId', '==', uid);
        } else {
             // For any other collection, default to filtering by userId if it exists
             // This is a safe default, but you might need more specific rules
             query = query.where('userId', '==', uid);
        }
    }
    
    // Apply any additional filters passed from the client for admins
    // or for collections that don't have the strict non-admin rules above
    if (filters) {
      for (const key in filters) {
        // Skip artistId filter for non-admins on 'works' as it's already applied
        if (!isAdmin && collectionPath === 'works' && key === 'artistId') continue;
        
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
