
"use server";

import { getFirebaseAdmin } from "@/firebase/admin";
import { doc, runTransaction, serverTimestamp, collection, addDoc, getDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

interface CreateVsdTransactionParams {
    userId: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'service_fee' | 'purchase' | 'sale' | 'reward';
    details: string;
}

export async function createVsdTransaction(params: CreateVsdTransactionParams): Promise<{ success: boolean; message: string }> {
    const { userId, amount, type, details } = params;
    if (!userId) {
        return { success: false, message: 'User ID is required.' };
    }

    try {
        const { db } = await getFirebaseAdmin();
        const userRef = doc(db, 'users', userId);
        const vsdTransactionsCollection = collection(db, 'vsd_transactions');

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw new Error("User document does not exist!");
            }

            const currentBalance = userDoc.data().vsdBalance || 0;
            const newBalance = currentBalance + amount;

            if (newBalance < 0) {
                throw new Error("Insufficient VSD balance for this transaction.");
            }

            // Update user's balance
            transaction.update(userRef, { vsdBalance: newBalance });

            // Create a new transaction document
            const transactionRef = doc(vsdTransactionsCollection);
            transaction.set(transactionRef, {
                userId,
                amount,
                type,
                details,
                transactionDate: serverTimestamp(),
                balanceBefore: currentBalance,
                balanceAfter: newBalance,
            });
        });

        revalidatePath('/dashboard'); // Revalidate to show new balance
        return { success: true, message: 'Transaction completed successfully.' };

    } catch (error: any) {
        console.error("VSD Transaction failed:", error);
        return { success: false, message: error.message || 'Failed to complete VSD transaction.' };
    }
}


export async function claimDailyTokensAction(userId: string): Promise<{ message: string; success: boolean }> {
  if (!userId) {
    return { message: 'You must be logged in to claim tokens.', success: false };
  }

  try {
    const { db } = await getFirebaseAdmin();
    const userRef = doc(db, 'users', userId);
    
    const today = new Date().toISOString().split('T')[0];

    // Use a transaction to ensure atomicity
    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User not found.");
      }

      if (userDoc.data().dailyTokenClaimed === today) {
        return { success: false, message: 'You have already claimed your tokens for today.' };
      }

      // If we are here, it means the tokens can be claimed.
      // Use the centralized transaction function.
      await transaction.update(userRef, { dailyTokenClaimed: today });
      
      return { success: true };
    });

    if (!result.success) {
      return { success: false, message: result.message || 'Failed to claim tokens.' };
    }

    // Create the transaction outside of the check, but only if it passed
    await createVsdTransaction({
        userId,
        amount: 5,
        type: 'reward',
        details: 'Daily token claim'
    });
    
    revalidatePath('/dashboard');
    return { message: 'You have successfully claimed 5 VSD tokens!', success: true };
    
  } catch (error) {
    console.error('Error claiming daily tokens:', error);
    return { message: 'Failed to claim daily tokens. Please try again later.', success: false };
  }
}
