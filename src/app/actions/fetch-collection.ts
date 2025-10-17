
'use server';

import { getFirebaseAdmin } from '@/firebase/admin';
import { headers } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { CollectionReference, Timestamp } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

// This function recursively serializes data, converting Timestamps and other non-JSON-friendly types.
const serializeData = (data: any): any => {
    if (data === null || data === undefined || typeof data !== 'object') {
        return data;
    }

    if (data instanceof Timestamp) {
        return data.toDate().toISOString();
    }
    
    if (data instanceof Date) {
        return data.toISOString();
    }

    if (Array.isArray(data)) {
        return data.map(serializeData);
    }

    const serialized: { [key: string]: any } = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            serialized[key] = serializeData(data[key]);
        }
    }
    return serialized;
};

const serializeDoc = (doc: FirebaseFirestore.DocumentData) => {
    return {
        id: doc.id,
        ...serializeData(doc.data()),
    };
};


export async function fetchCollectionAction({ collectionPath, filters }: { collectionPath: string, filters?: Record<string, any> }) {
  try {
    const cookieStore = cookies();
    const idToken = cookieStore.get('firebaseIdToken')?.value;
    const { db } = await getFirebaseAdmin();

    // Public, unauthenticated access is allowed ONLY for the 'works' collection without filters.
    if (collectionPath === 'works' && !filters && !idToken) {
      const publicWorksSnap = await db.collection(collectionPath).get();
      const publicWorks = publicWorksSnap.docs.map(serializeDoc);
      return { data: publicWorks };
    }

    if (!idToken) {
      return { error: 'Unauthorized: A valid user token is required for this request.' };
    }

    const { auth: adminAuth } = await getFirebaseAdmin();
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
                .map(serializeDoc)
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
    const docs = snap.docs.map(serializeDoc);

    return { data: docs };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    console.error(`[Server Action fetchCollection] Error:`, errorMessage);
    // Ensure that even in case of an error, a serializable object is returned.
    return { error: "Internal Server Error", details: errorMessage };
  }
}
