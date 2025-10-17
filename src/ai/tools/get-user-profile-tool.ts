
'use server';

/**
 * @fileOverview A Genkit tool for fetching a user's complete profile from Firestore.
 */

import {ai} from '@/ai/genkit';
import {getFirebaseAdmin} from '@/firebase/admin';
import {doc, getDoc, collection, query, where, getDocs, orderBy, limit} from 'firebase/firestore';
import {z} from 'zod';

// Input schema for the tool - no longer needs userId
const UserProfileInputSchema = z.object({});

// Output schema for the tool
const TransactionSchema = z.object({
    id: z.string(),
    amount: z.number(),
    type: z.string(),
    details: z.string(),
    date: z.string(),
});

const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  email: z.string().optional(),
  vsdBalance: z.number().optional(),
  recentTransactions: z.array(TransactionSchema).optional(),
});


export const getUserProfile = ai.defineTool(
  {
    name: 'getUserProfile',
    description: "Retrieves the current user's profile information, including their VSD token balance and a summary of their most recent transactions. Use this to provide personalized context in conversation.",
    inputSchema: UserProfileInputSchema,
    outputSchema: UserProfileSchema,
    contextSchema: z.object({ userId: z.string() })
  },
  async (input, context) => {
    try {
      const {db} = await getFirebaseAdmin();
      const userId = context.userId;

      if (!userId) {
        throw new Error("User ID is missing from context.");
      }
      
      // 1. Fetch user document
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
      const userData = userDoc.data();

      // 2. Fetch recent transactions
      const transRef = collection(db, 'vsd_transactions');
      // THIS IS THE DEFINITIVE FIX: Removed the orderBy clause to prevent a composite index requirement.
      const q = query(
          transRef, 
          where('userId', '==', userId),
          limit(5)
        );
      
      const transSnapshot = await getDocs(q);
      const recentTransactions = transSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              id: doc.id,
              amount: data.amount,
              type: data.type,
              details: data.details,
              // Convert Firestore Timestamp to ISO string for consistent serialization
              date: data.transactionDate.toDate().toISOString(),
          };
      });

      // 3. Construct and return the full profile
      return {
          id: userDoc.id,
          username: userData.username,
          email: userData.email,
          vsdBalance: userData.vsdBalance,
          recentTransactions: recentTransactions,
      };

    } catch (error) {
        console.error("Error fetching user profile:", error);
        // In case of error, return a partial or empty object.
        // The LLM can then inform the user that it couldn't fetch the data.
        return {
            id: context.userId,
            error: error instanceof Error ? error.message : "Unknown error occurred.",
        } as any;
    }
  }
);
