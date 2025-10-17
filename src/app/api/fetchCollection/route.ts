
import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/firebase/admin';
import { headers } from 'next/headers';
import { Auth } from 'firebase-admin/auth';
import { Query } from 'firebase-admin/firestore';

async function verifyToken(auth: Auth, idToken: string) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export async function POST(request: Request) {
  const { collectionPath, filters } = await request.json();
  const headersList = headers();
  const authorization = headersList.get('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const idToken = authorization.split('Bearer ')[1];
  
  try {
    const { auth: adminAuth, db } = await getFirebaseAdmin();
    const decodedToken = await verifyToken(adminAuth, idToken);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;
    
    // Server-side fetch from Firestore
    let query: Query = db.collection(collectionPath);
    
    // Apply server-side filters if they exist
    if (filters) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          query = query.where(key, '==', filters[key]);
        }
      }
    }

    const snap = await query.get();

    // After fetching, apply security filtering based on user role
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
