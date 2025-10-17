
"use server";

import { getFirebaseAdmin } from "@/firebase/admin";
import { doc, runTransaction, serverTimestamp, collection, addDoc } from "firebase/firestore";
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
        // The transaction now operates on the main user document
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
                throw new Error("Insufficient VSD-lite balance for this transaction.");
            }

            // Update user's balance directly on their user document
            transaction.update(userRef, { vsdBalance: newBalance });

            // Create a new transaction document for the ledger (this remains unchanged)
            const transactionRef = doc(vsdTransactionsCollection); // Creates a ref with a new auto-ID
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

        revalidatePath('/dashboard/wallet'); // Revalidate wallet page to show new balance
        revalidatePath('/dashboard'); // Also revalidate dashboard for stat cards
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
    // The transaction now operates on the main user document
    const userRef = doc(db, 'users', userId);
    
    const today = new Date().toISOString().split('T')[0];

    // Use a transaction to ensure atomicity
    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User document not found.");
      }

      if (userDoc.data().dailyTokenClaimed === today) {
        return { success: false, message: 'You have already claimed your credits for today.' };
      }

      // If we are here, it means the tokens can be claimed.
      // Update the claim date on the user document itself.
      transaction.update(userRef, { dailyTokenClaimed: today });
      
      return { success: true, isNewClaim: true };
    });

    if (!result.success) {
      return { success: false, message: result.message || 'Failed to claim credits.' };
    }

    // Only create the transaction if it was a new claim
    if (result.isNewClaim) {
        await createVsdTransaction({
            userId,
            amount: 5,
            type: 'reward',
            details: 'Daily credits claim'
        });
    }
    
    revalidatePath('/dashboard');
    return { message: 'You have successfully claimed 5 VSD-lite credits!', success: true };
    
  } catch (error) {
    console.error('Error claiming daily tokens:', error);
    return { message: 'Failed to claim daily credits. Please try again later.', success: false };
  }
}

    