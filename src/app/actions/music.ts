
"use server";

import { z } from "zod";
import { getFirebaseAdmin } from "@/firebase/admin";
import { collection, addDoc, serverTimestamp, doc, deleteDoc, updateDoc, query, where, getDocs, increment } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { createVsdTransaction } from "./vsd-transaction";
import { generateReport } from "@/ai/flows/generate-report-flow";


const uploadWorkSchema = z.object({
    trackTitle: z.string().min(1, "Work title is required."),
    artistId: z.string().min(1, "Artist ID is required."),
    artistName: z.string().min(1, "Artist name is required."),
    genre: z.string().min(1, "Genre is required."),
    description: z.string().optional(),
});

type UploadWorkState = {
    message?: string | null;
    errors?: {
        trackTitle?: string[];
        artistName?: string[];
        genre?: string[];
        _form?: string[];
    }
}


export async function uploadTrackAction(
    prevState: UploadWorkState,
    formData: FormData,
): Promise<UploadWorkState> {
    
    const validatedFields = uploadWorkSchema.safeParse({
        trackTitle: formData.get("trackTitle"),
        artistId: formData.get("artistId"),
        artistName: formData.get("artistName"),
        genre: formData.get("genre"),
        description: formData.get("description"),
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing or invalid fields. Failed to upload work.",
        };
    }

    const { trackTitle, artistId, artistName, genre, description } = validatedFields.data;

    try {
        const { db } = await getFirebaseAdmin();
        const worksCollection = collection(db, "works");
        
        // In a real app, the audio would be uploaded to Cloud Storage, 
        // and this URL would point to it. The `onWorkCreated` function
        // would be triggered by that upload.
        // For now, we use a placeholder and write directly to Firestore.
        const demoTrackUrl = "https://storage.googleapis.com/studiopublic/vndr/synthwave-track.mp3";
        
        await addDoc(worksCollection, {
            title: trackTitle,
            artistId: artistId,
            artistName: artistName,
            genre: genre,
            description: description,
            uploadDate: serverTimestamp(),
            status: "processing", // Initial status
            trackUrl: demoTrackUrl, // Placeholder URL
            
            // These fields will be populated by the backend workers
            coverArtUrl: "https://picsum.photos/seed/placeholder/400/400", // Placeholder
            audioFeatures: null,
            musoCreditsFetched: false,
            enrichedMetadata: null,
            plays: 0,
        });

        // In a real app, revalidation would happen after workers complete,
        // often via a client-side listener or another trigger.
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/my-works');
        revalidatePath(`/profile/${artistId}`);

        return {
            message: "Work uploaded successfully! Processing has begun.",
        };

    } catch (error) {
        console.error(error);
        return {
            message: "An error occurred during upload.",
            errors: { _form: ["Failed to save work to database. Please try again."] }
        }
    }
}


export async function deleteTrackAction(trackId: string, artistId: string) {
    if (!trackId || !artistId) {
        return { error: 'Missing track or artist ID.' };
    }

    try {
        const { db } = await getFirebaseAdmin();
        // Point to the 'works' collection now
        await deleteDoc(doc(db, 'works', trackId));

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/my-works');
        revalidatePath(`/profile/${artistId}`);

        return { message: 'Work deleted successfully.' };
    } catch (error) {
        console.error('Error deleting work:', error);
        return { error: 'Failed to delete work.' };
    }
}

export async function trackPlays(trackId: string) {
  if (!trackId) {
    return { error: 'Missing track ID.' };
  }

  try {
    const { db } = await getFirebaseAdmin();
    const trackRef = doc(db, 'works', trackId);
    await updateDoc(trackRef, {
      plays: increment(1),
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error incrementing track plays:', error);
    return { error: 'Failed to update play count.' };
  }
}

export async function generateReportAction(userId: string): Promise<{ success: boolean; message?: string; report?: string }> {
  if (!userId) {
    return { success: false, message: "User not found." };
  }

  try {
    // 1. Deduct VSD token
    const transactionResult = await createVsdTransaction({
      userId,
      amount: -25, // Report cost
      type: 'service_fee',
      details: 'AI performance report generation',
    });

    if (!transactionResult.success) {
      return { success: false, message: transactionResult.message };
    }

    // 2. Fetch artist's tracks from the 'works' collection
    const { db } = await getFirebaseAdmin();
    const worksRef = collection(db, "works");
    const q = query(worksRef, where("artistId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Refund the VSD token if no tracks are found
      await createVsdTransaction({
          userId,
          amount: 25,
          type: 'deposit',
          details: 'Refund for report generation (no works found)',
      });
      return { success: false, message: "You don't have any works to generate a report for." };
    }

    const tracks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Call the Genkit flow
    const report = await generateReport({ tracks });

    return { success: true, report: report.report };
  } catch (error) {
    console.error('Error generating report:', error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    // Attempt to refund on failure
     await createVsdTransaction({
        userId,
        amount: 25,
        type: 'deposit',
        details: 'Refund for failed report generation',
    });
    return { success: false, message: `Report generation failed and your VSD has been refunded. Reason: ${errorMessage}` };
  }
}
