
import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/firebase/admin';
import { headers } from 'next/headers';
import { Auth, getAuth } from 'firebase-admin/auth';

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
    
    // Determine owner field based on collection
    let ownerField = 'userId';
    if (collectionPath === 'works') {
        ownerField = 'artistId';
    } else if (collectionPath === 'license_requests') {
        // For license requests, a user might be the artist OR the requestor
        // A more complex logic might be needed if users need to see requests they made
        // For now, we assume artists manage requests made for their work.
        ownerField = 'artistId';
    }


    let query: FirebaseFirestore.Query = db.collection(collectionPath);
    
    const snap = await query.get();

    const docs = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(doc => {
        // Admins can see everything
        if (isAdmin) return true;
        // Non-admins can only see their own documents
        return doc[ownerField] === uid;
      });

    return NextResponse.json(docs);

  } catch (error) {
    console.error(`Error fetching collection ${collectionPath}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred on the server.";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
