
"use server";

import { z } from "zod";
import { getFirebaseAdmin } from "@/firebase/admin";
import { collection, addDoc, serverTimestamp, doc, deleteDoc, updateDoc, query, where, getDocs, increment, getDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { createVsdTransaction } from "./vsd-transaction";
import { generateReport } from "@/ai/flows/generate-report-flow";
import { Track, TrackSchema } from "@/store/music-player-store";
import { getMusoExposureScore } from "@/services/muso";


const uploadWorkSchema = z.object({
    trackTitle: z.string().min(1, "Work title is required."),
    artistId: z.string().min(1, "Artist ID is required."),
    artistName: z.string().min(1, "Artist name is required."),
    genre: z.string().min(1, "Genre is required."),
    description: z.string().optional(),
    coverArtDataUri: z.string().min(1, "A cover art image is required."),
    price: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number().min(0).optional()
    ),
});

type UploadWorkState = {
    message?: string | null;
    errors?: {
        trackTitle?: string[];
        artistName?: string[];
        genre?: string[];
        coverArtDataUri?: string[];
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
        coverArtDataUri: formData.get("coverArtDataUri"),
        price: formData.get("price"),
    });
    
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten());
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing or invalid fields. Failed to upload work.",
        };
    }

    const { trackTitle, artistId, artistName, genre, description, coverArtDataUri, price } = validatedFields.data;

    try {
        const { db } = await getFirebaseAdmin();
        const worksCollection = collection(db, "works");
        
        // This simulates the backend `onWorkCreated` trigger. In a real app,
        // this data would be populated by separate serverless functions.
        const demoTrackUrl = "https://storage.googleapis.com/studiopublic/vndr/synthwave-track.mp3";
        
        const newWorkData = {
            title: trackTitle,
            artistId: artistId,
            artistName: artistName,
            genre: genre,
            description: description,
            uploadDate: serverTimestamp(), // This value exists only on the server
            status: "processing", // Initial status
            trackUrl: demoTrackUrl,
            coverArtUrl: coverArtDataUri,
            price: price || null,
            plays: 0,
            
            audioFeatures: null, 
            musoCreditsFetched: false,
            acrCloudFingerprinted: false,
            enrichedMetadata: null,
            musoExposureScore: null,
        };

        const newWorkRef = await addDoc(worksCollection, newWorkData);

        // Start the enrichment process asynchronously (don't block the UI response)
        enrichWork(newWorkRef.id, artistName, trackTitle);

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/my-works');
        revalidatePath(`/profile/${artistId}`);
        
        // Return a simple, serializable object. Do NOT return the newWorkData object
        // because it contains serverTimestamp(), which is not serializable.
        return {
            message: "Work uploaded! Autonomous processing has begun. Check 'My Works' for status updates.",
        };

    } catch (error) {
        console.error(error);
        return {
            message: "An error occurred during upload.",
            errors: { _form: ["Failed to save work to database. Please try again."] }
        }
    }
}

/**
 * Asynchronous function to enrich a work document with data from external APIs.
 * This simulates a backend cloud function trigger.
 * @param workId The ID of the work document in Firestore.
 * @param artistName The name of the artist.
 * @param trackTitle The title of the track.
 */
async function enrichWork(workId: string, artistName: string, trackTitle: string) {
    try {
        const { db } = await getFirebaseAdmin();
        const workRef = doc(db, "works", workId);

        // 1. Fetch data from Muso.AI
        const exposureScore = await getMusoExposureScore(artistName, trackTitle);

        // 2. Simulate other processing steps (like audio analysis)
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second delay for ACRCloud, etc.
        const simulatedAudioFeatures = {
            bpm: 120,
            key: 'Cmin',
            loudness: -8.5,
            energy: 0.75,
            mood: ['dramatic', 'energetic'],
            instrumentalRatio: 0.95
        };

        // 3. Update the document in Firestore with all enriched data
        await updateDoc(workRef, {
            musoExposureScore: exposureScore,
            musoCreditsFetched: true,
            audioFeatures: simulatedAudioFeatures,
            acrCloudFingerprinted: true,
            status: "published",
        });

        console.log(`Successfully enriched work ID: ${workId}`);
        // Revalidate paths after enrichment is complete to show the "Published" status
        revalidatePath('/dashboard/my-works');

    } catch (error) {
        console.error(`Failed to enrich work ID ${workId}:`, error);
        // Optional: Update the work document to an "error" status
        const { db } = await getFirebaseAdmin();
        await updateDoc(doc(db, "works", workId), {
            status: 'error',
            errorDetails: 'Failed during enrichment process.',
        });
    }
}


export async function deleteTrackAction(trackId: string, artistId: string) {
    if (!trackId || !artistId) {
        return { error: 'Missing work or artist ID.' };
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
    // Revalidate paths that might show play counts
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/my-works');
    revalidatePath('/admin');
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
      // Refund the VSD token if no works are found
      await createVsdTransaction({
          userId,
          amount: 25,
          type: 'deposit',
          details: 'Refund for report generation (no works found)',
      });
      return { success: false, message: "You don't have any works to generate a report for." };
    }

    const tracks = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure the data conforms to the Track schema, providing defaults
      return {
        id: doc.id,
        title: data.title || '',
        artistId: data.artistId || '',
        artistName: data.artistName || '',
        genre: data.genre || '',
        plays: data.plays || 0,
        price: data.price,
        coverArtUrl: data.coverArtUrl,
        trackUrl: data.trackUrl,
      };
    }).filter(track => TrackSchema.safeParse(track).success) as Track[];
    

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


const licenseRequestSchema = z.object({
  requestorId: z.string().min(1, "Requestor ID is required"),
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address."),
  trackTitle: z.string().min(1, "Track title is required."),
  artistName: z.string().min(1, "Artist name is required."),
  usageType: z.string().min(1, "Intended use is required."),
  description: z.string().min(1, "Project description is required."),
});

type LicenseRequestState = {
  message?: string | null;
  errors?: {
    fullName?: string[];
    email?: string[];
    trackTitle?: string[];
    artistName?: string[];
    usageType?: string[];
    description?: string[];
    _form?: string[];
  }
}

export async function submitLicenseRequestAction(prevState: LicenseRequestState, formData: FormData): Promise<LicenseRequestState> {
  const validatedFields = licenseRequestSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to submit request.",
    };
  }

  const { requestorId, fullName, email, trackTitle, artistName, usageType, description } = validatedFields.data;

  try {
    const { db } = await getFirebaseAdmin();

    // Find the work and the artist to assign the request to
    const worksRef = collection(db, "works");
    const q = query(worksRef, where("title", "==", trackTitle), where("artistName", "==", artistName));
    const workSnapshot = await getDocs(q);

    if (workSnapshot.empty) {
      return {
        errors: { _form: ["Could not find a matching track. Please check the track title and artist name."] },
        message: "Submission failed.",
      };
    }
    const workDoc = workSnapshot.docs[0];
    const artistId = workDoc.data().artistId;

    const requestsCollection = collection(db, "license_requests");
    await addDoc(requestsCollection, {
      artistId: artistId,
      requestorId: requestorId,
      requestorName: fullName,
      requestorEmail: email,
      trackId: workDoc.id,
      trackTitle: trackTitle,
      usageType: usageType,
      projectDescription: description,
      status: "pending",
      requestDate: serverTimestamp(),
    });

    revalidatePath("/dashboard/licensing");

    return { message: "Your license request has been submitted successfully." };

  } catch (error) {
    console.error("License Request Error:", error);
    return {
      errors: { _form: ["An internal error occurred. Please try again later."] },
      message: "Submission failed.",
    }
  }
}

export async function approveLicenseRequestAction(requestId: string): Promise<{ success: boolean; message: string }> {
  if (!requestId) return { success: false, message: "Request ID is missing." };

  try {
    const { db } = await getFirebaseAdmin();
    const requestRef = doc(db, 'license_requests', requestId);
    await updateDoc(requestRef, { status: 'approved' });
    revalidatePath('/dashboard/licensing');
    return { success: true, message: 'Request approved.' };
  } catch (error) {
    console.error("Error approving request:", error);
    return { success: false, message: 'Failed to approve request.' };
  }
}

export async function rejectLicenseRequestAction(requestId: string): Promise<{ success: boolean; message: string }> {
  if (!requestId) return { success: false, message: "Request ID is missing." };

  try {
    const { db } = await getFirebaseAdmin();
    const requestRef = doc(db, 'license_requests', requestId);
    await updateDoc(requestRef, { status: 'rejected' });
    revalidatePath('/dashboard/licensing');
    return { success: true, message: 'Request rejected.' };
  } catch (error) {
    console.error("Error rejecting request:", error);
    return { success: false, message: 'Failed to reject request.' };
  }
}

    
