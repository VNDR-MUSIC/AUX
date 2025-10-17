
'use server';

import { getFirebaseAdmin } from '@/firebase/admin';
import { headers } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { CollectionReference, Timestamp } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

// This function serializes data, converting Timestamps to ISO strings.
const serializeData = (doc: FirebaseFirestore.DocumentData) => {
    const data = doc.data();
    const serialized: {[key: string]: any} = { id: doc.id };
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (value instanceof Timestamp) {
                // Convert Firestore Timestamps to ISO strings
                serialized[key] = value.toDate().toISOString();
            } else {
                serialized[key] = value;
            }
        }
    }
    return serialized;
}

export async function fetchCollectionAction({ collectionPath, filters }: { collectionPath: string, filters?: Record<string, any> }) {
  try {
    const cookieStore = cookies();
    const idToken = cookieStore.get('firebaseIdToken')?.value;

    // Public, unauthenticated access is allowed ONLY for the 'works' collection without filters.
    if (collectionPath === 'works' && !filters && !idToken) {
      const { db } = await getFirebaseAdmin();
      const publicWorksSnap = await db.collection(collectionPath).get();
      const publicWorks = publicWorksSnap.docs.map(serializeData);
      return { data: publicWorks };
    }

    if (!idToken) {
      return { error: 'Unauthorized: A valid user token is required for this request.' };
    }

    const { auth: adminAuth, db } = await getFirebaseAdmin();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (!decodedToken) {
        return { error: 'Unauthorized: Invalid token.' };
    }
    
    const uid = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;
    
    let query: CollectionReference | FirebaseFirestore.Query = db.collection(collectionPath);
    
    if (!isAdmin) {
        if (collectionPath === 'license_requests') {
             const snap = await query.get();
             const docs = snap.docs
                .map(serializeData)
                .filter((doc: any) => doc.artistId === uid || doc.requestorId === uid);
             return { data: docs };
        }

        const ownerField = collectionPath === 'works' ? 'artistId' : 'userId';
        query = query.where(ownerField, '==', uid);
    }
    
    if (filters) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          if (filters[key] === null || filters[key] === undefined) continue;
          query = query.where(key, '==', filters[key]);
        }
      }
    }

    const snap = await query.get();
    const docs = snap.docs.map(serializeData);

    return { data: docs };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    console.error(`[Server Action fetchCollection] Error:`, errorMessage);
    return { error: "Internal Server Error", details: errorMessage };
  }
}
