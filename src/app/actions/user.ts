
'use server';

import { z } from 'zod';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { setDoc, doc, updateDoc } from 'firebase/firestore';
import { getFirebaseAdmin } from '@/firebase/admin';
import { createVsdTransaction } from './vsd-transaction';

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
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
    const userCredential = await adminAuth.createUser({ email, password });

    // Create user document in Firestore
    const userRef = doc(db, 'users', userCredential.uid);
    await setDoc(userRef, {
      id: userCredential.uid,
      email: email,
      role: 'artist',
      username: email.split('@')[0], // Default username
      vsdBalance: 0, // Initial balance is 0, will be updated by transaction
      onboardingCompleted: {
        dashboard: false,
        upload: false,
        catalog: false,
        licensing: false,
        auctions: false,
        legalEagle: false,
        settings: false,
      },
    });

    // Grant initial tokens via a transaction
    await createVsdTransaction({
      userId: userCredential.uid,
      amount: 10,
      type: 'deposit',
      details: 'Initial sign-up reward',
    });

    // If the user is the special support email, set the admin custom claim
    if (email === 'support@vndrmusic.com') {
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

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  // This is a placeholder as client-side login is preferred
  return {
    message: 'Redirecting to dashboard...',
  };
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
    // This revalidation is not strictly needed for the client to see the change,
    // but good practice for any Server Components that might depend on this data.
    // revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error(`Error completing onboarding step "${step}":`, error);
    return { success: false };
  }
}
