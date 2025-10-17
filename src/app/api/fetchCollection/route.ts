
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
  const { collectionPath, filters } = await request.json();
  
  if (!collectionPath) {
     return NextResponse.json({ error: 'Collection path is required.' }, { status: 400 });
  }

  const headersList = headers();
  const authorization = headersList.get('Authorization');
  const idToken = authorization?.split('Bearer ')[1];

  try {
    const { auth: adminAuth, db } = await getFirebaseAdmin();
    let decodedToken = null;
    if (idToken) {
        decodedToken = await verifyToken(adminAuth, idToken);
    }
    
    const uid = decodedToken?.uid;
    const isAdmin = decodedToken?.admin === true;
    
    // --- THIS IS THE FIX ---
    // If the collection is 'works' (the public catalog), we don't require authentication
    // unless a specific user's works are being requested via filters.
    if (collectionPath === 'works' && !filters) {
       const publicWorksSnap = await db.collection(collectionPath).get();
       const publicWorks = publicWorksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       return NextResponse.json(publicWorks);
    }
    
    // For all other requests, or filtered 'works' requests, enforce authentication.
    if (!uid) {
        return NextResponse.json({ error: 'Unauthorized: A valid user token is required for this request.' }, { status: 401 });
    }
    
    let query: CollectionReference | FirebaseFirestore.Query = db.collection(collectionPath);
    
    // Apply server-side filters if they exist
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

    // After fetching, apply security filtering based on user role and ownership.
    const docs = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(doc => {
        // Admins can see everything
        if (isAdmin) return true;
        
        // Special logic for license_requests: user can be artist OR requestor
        if (collectionPath === 'license_requests') {
            return doc.artistId === uid || doc.requestorId === uid;
        }

        // Standard ownership check for other collections
        const ownerField = collectionPath === 'works' ? 'artistId' : 'userId';
        return doc[ownerField] === uid;
      });

    return NextResponse.json(docs);

  } catch (error) {
    console.error(`Error fetching collection ${collectionPath}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred on the server.";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
