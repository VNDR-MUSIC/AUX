
import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/firebase/admin';
import { headers } from 'next/headers';
import { Auth } from 'firebase-admin/auth';
import { CollectionReference } from 'firebase-admin/firestore';

async function verifyToken(auth: Auth, idToken: string) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    // This is expected if the token is invalid or expired
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { collectionPath, filters } = await request.json();
    
    if (!collectionPath) {
      return NextResponse.json({ error: 'Collection path is required.' }, { status: 400 });
    }

    const headersList = headers();
    const authorization = headersList.get('Authorization');
    const idToken = authorization?.split('Bearer ')[1];
    
    // Public, unauthenticated access is allowed ONLY for the 'works' collection without filters.
    // This is for the main public catalog page.
    if (collectionPath === 'works' && !filters && !idToken) {
      const { db } = await getFirebaseAdmin();
      const publicWorksSnap = await db.collection(collectionPath).get();
      const publicWorks = publicWorksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json(publicWorks);
    }

    // All other requests require authentication.
    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized: A valid user token is required for this request.' }, { status: 401 });
    }

    const { auth: adminAuth, db } = await getFirebaseAdmin();
    const decodedToken = await verifyToken(adminAuth, idToken);
    
    if (!decodedToken) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
    }
    
    const uid = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;
    
    let query: CollectionReference | FirebaseFirestore.Query = db.collection(collectionPath);
    
    // --- Server-Side Security Filtering ---
    if (!isAdmin) {
        // Special logic for license_requests: user can be artist OR requestor.
        // This cannot be done with a single Firestore query, so we fetch and filter on the server.
        if (collectionPath === 'license_requests') {
             const snap = await query.get();
             const docs = snap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(doc => doc.artistId === uid || doc.requestorId === uid);
             return NextResponse.json(docs);
        }

        // Standard ownership check for other collections.
        const ownerField = collectionPath === 'works' ? 'artistId' : 'userId';
        query = query.where(ownerField, '==', uid);
    }
    
    // Apply additional client-side filters if they exist
    if (filters) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          // Skip if filter value is null or undefined to avoid invalid queries
          if (filters[key] === null || filters[key] === undefined) continue;
          query = query.where(key, '==', filters[key]);
        }
      }
    }

    const snap = await query.get();
    const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(docs);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    console.error(`[API /api/fetchCollection] Error:`, errorMessage);
    // Ensure that even in the case of an unexpected error, a JSON response is sent.
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
