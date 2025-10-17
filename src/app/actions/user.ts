
"use server";

import { z } from 'zod';
import { getFirebaseAdmin } from '@/firebase/admin';
import { createVsdTransaction } from './vsd-transaction';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type AuthState = {
  message?: string | null;
  user?: { uid: string; email: string | null } | null;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function signupAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = SignUpSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to sign up.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const { db, auth: adminAuth } = await getFirebaseAdmin();
    
    // If the user is the special support email, set up admin properties
    const isAdminUser = email === 'support@vndrmusic.com';
    
    const userProperties = {
      email,
      password,
      ...(isAdminUser && { displayName: 'VNDR Support' })
    };

    const userCredential = await adminAuth.createUser(userProperties);
    
    // Create user document in Firestore, now including vsdBalance
    const userRef = doc(db, 'users', userCredential.uid);
    await setDoc(userRef, {
      id: userCredential.uid,
      email: email,
      role: isAdminUser ? 'admin' : 'artist',
      username: isAdminUser ? 'VNDR Support' : email.split('@')[0], // Default username
      onboardingCompleted: {
        dashboard: false,
        upload: false,
        catalog: false,
        licensing: false,
        auctions: false,
        contracts: false,
        legalEagle: false,
        settings: false,
      },
      vsdBalance: 0, // Initialize balance directly on the user document
      dailyTokenClaimed: null, // Track daily claims on user document
    });

    // Grant initial tokens via a transaction (which now updates the user doc)
    await createVsdTransaction({
      userId: userCredential.uid,
      amount: 10,
      type: 'deposit',
      details: 'Initial sign-up reward',
    });

    if (isAdminUser) {
      await adminAuth.setCustomUserClaims(userCredential.uid, { admin: true });
      const adminRoleRef = doc(db, 'roles_admin', userCredential.uid);
      await setDoc(adminRoleRef, { isAdmin: true });
    }

    return {
      message: 'Sign up successful! Welcome to VNDR.',
      user: {
        uid: userCredential.uid,
        email: userCredential.email,
      },
    };
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already in use. Please log in instead.';
    }
    console.error('Sign up error:', error);
    return {
      message: 'Sign up failed.',
      errors: {
        _form: [errorMessage],
      },
    };
  }
}

export async function completeOnboardingStepAction(
  userId: string,
  step: string
): Promise<{ success: boolean }> {
  if (!userId || !step) {
    return { success: false };
  }

  try {
    const { db } = await getFirebaseAdmin();
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`onboardingCompleted.${step}`]: true,
    });
    return { success: true };
  } catch (error) {
    console.error(`Error completing onboarding step "${step}":`, error);
    return { success: false };
  }
}
