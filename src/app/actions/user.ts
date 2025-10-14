"use server";

import { z } from "zod";
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { setDoc, doc, updateDoc, increment } from "firebase/firestore";
import { getFirebaseAdmin } from "@/firebase/admin";
import { revalidatePath } from "next/cache";

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
  user?: User | null;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function signupAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to sign up.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const {db, auth: adminAuth} = await getFirebaseAdmin();
    const userCredential = await adminAuth.createUser({email, password});
    
    // Create user document in Firestore
    const userRef = doc(db, "users", userCredential.uid);
    await setDoc(userRef, {
      id: userCredential.uid,
      email: email,
      role: "artist",
      username: email.split('@')[0], // Default username
      vsdBalance: 10, // Initial free token balance
      dailyTokenClaimed: new Date().toISOString().split('T')[0], // Set today as claimed
      onboardingCompleted: {
        dashboard: false,
        upload: false,
        catalog: false,
        licensing: false,
        auctions: false,
        legalEagle: false,
        settings: false,
      }
    });

    return {
      message: "Sign up successful! Welcome to VNDR.",
      user: userCredential as unknown as User,
    };
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred.";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "This email is already in use. Please log in instead.";
    }
    console.error("Sign up error:", error);
    return {
      message: "Sign up failed.",
      errors: {
        _form: [errorMessage],
      },
    };
  }
}

export async function loginAction(
    prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    // This is a placeholder as client-side login is preferred
    return {
        message: "Redirecting to dashboard..."
    }
}

export async function claimDailyTokensAction(userId: string): Promise<{ message: string; success: boolean }> {
  if (!userId) {
    return { message: 'You must be logged in to claim tokens.', success: false };
  }

  try {
    const { db } = await getFirebaseAdmin();
    const userRef = doc(db, 'users', userId);

    // This would typically be a transaction in a real app to ensure atomicity
    await updateDoc(userRef, {
      vsdBalance: increment(5),
      dailyTokenClaimed: new Date().toISOString().split('T')[0],
    });

    revalidatePath('/dashboard');
    return { message: 'You have successfully claimed 5 VSD tokens!', success: true };
  } catch (error) {
    console.error('Error claiming daily tokens:', error);
    return { message: 'Failed to claim daily tokens. Please try again later.', success: false };
  }
}

export async function completeOnboardingStepAction(userId: string, step: string): Promise<{ success: boolean }> {
  if (!userId || !step) {
    return { success: false };
  }

  try {
    const { db } = await getFirebaseAdmin();
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`onboardingCompleted.${step}`]: true,
    });
    revalidatePath('/dashboard'); // Revalidate to update user data everywhere
    return { success: true };
  } catch (error) {
    console.error(`Error completing onboarding step "${step}":`, error);
    return { success: false };
  }
}
