
'use server';

import { getFirebaseAdmin } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { CollectionReference, Timestamp } from 'firebase-admin/firestore';

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

    // This handles nested objects
    const serialized: { [key: string]: any } = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            serialized[key] = serializeData(data[key]);
        }
    }
    return serialized;
};

const serializeDoc = (doc: FirebaseFirestore.DocumentSnapshot) => {
    return {
        id: doc.id,
        ...serializeData(doc.data()),
    };
};


export async function fetchCollectionAction({ collectionPath, filters }: { collectionPath: string, filters?: Record<string, any> }) {
  try {
    const cookieStore = cookies();
    const idToken = cookieStore.get('firebaseIdToken')?.value;
    const { db, auth: adminAuth } = await getFirebaseAdmin();

    // Public, unauthenticated access for 'works' collection
    if (collectionPath === 'works' && !filters && !idToken) {
      const publicWorksSnap = await db.collection(collectionPath).get();
      const publicWorks = publicWorksSnap.docs.map(serializeDoc);
      return { data: publicWorks };
    }

    // Authenticated access for all other collections
    if (!idToken) {
      // This is not an error, but a state where the user is not logged in.
      // The client should handle this gracefully (e.g., show a login prompt).
      return { data: [] }; 
    }
    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;
    
    let query: CollectionReference | FirebaseFirestore.Query = db.collection(collectionPath);
    
    // Apply security rules logic server-side
    if (!isAdmin) {
        if (collectionPath === 'license_requests') {
             // For license requests, fetch all and then filter for artist OR requestor
             const snap = await query.get();
             const docs = snap.docs
                .map(serializeDoc)
                .filter((doc: any) => doc.artistId === uid || doc.requestorId === uid);
             return { data: docs };
        } else if (collectionPath !== 'works' || (collectionPath === 'works' && filters?.artistId)) {
             // For most collections, filter by ownership
            const ownerField = collectionPath === 'works' ? 'artistId' : 'userId';
            query = query.where(ownerField, '==', uid);
        }
    }
    
    // Apply additional filters from the client
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
    console.error(`[Server Action Error] Path: ${collectionPath}`, errorMessage);
    // CRITICAL: Always return a serializable JSON object, even on failure.
    return { error: "Internal Server Error", details: errorMessage };
  }
}
