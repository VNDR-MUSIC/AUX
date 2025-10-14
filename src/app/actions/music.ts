"use server";

import { z } from "zod";
import { generateCoverArt } from "@/ai/flows/ai-cover-art-generation";
import { recommendLicensingPrice } from "@/ai/flows/ai-licensing-price-recommendation";
import { getFirebaseAdmin } from "@/firebase/admin";
import { collection, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";


const coverArtSchema = z.object({
  trackTitle: z.string().min(1, "Track title is required."),
  genre: z.string().min(1, "Genre is required."),
});

type CoverArtState = {
  message?: string | null;
  coverArtDataUri?: string | null;
  errors?: {
    trackTitle?: string[];
    genre?: string[];
    _form?: string[];
  }
}

const licensingPriceSchema = z.object({
  genre: z.string().min(1, "Genre is required."),
  description: z.string().optional(),
});

type LicensingPriceState = {
    message?: string | null;
    recommendedPrice?: number | null;
    justification?: string | null;
    errors?: {
        genre?: string[];
        _form?: string[];
    }
}

const uploadTrackSchema = z.object({
    trackTitle: z.string().min(1, "Track title is required."),
    artistId: z.string().min(1, "Artist ID is required."),
    artistName: z.string().min(1, "Artist name is required."),
    genre: z.string().min(1, "Genre is required."),
    description: z.string().optional(),
    price: z.number().optional(),
    coverArtDataUri: z.string().min(1, "Cover art is required."),
});

type UploadTrackState = {
    message?: string | null;
    errors?: {
        trackTitle?: string[];
        artistName?: string[];
        genre?: string[];
        price?: string[];
        coverArtDataUri?: string[];
        _form?: string[];
    }
}

const licenseRequestSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address."),
  trackTitle: z.string().min(1, "Track title is required."),
  artistName: z.string().min(1, "Artist name is required."),
  usageType: z.string().min(1, "Intended use is required."),
  description: z.string().min(1, "Project description is required."),
  // In a real app, you would have trackId and requestorId from the logged-in user session
  trackId: z.string().optional(), 
  requestorId: z.string().optional(),
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


export async function generateCoverArtAction(
  prevState: CoverArtState,
  formData: FormData
): Promise<CoverArtState> {
  const validatedFields = coverArtSchema.safeParse({
    trackTitle: formData.get("trackTitle"),
    genre: formData.get("genre"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to generate cover art.",
    };
  }
  
  const { trackTitle, genre } = validatedFields.data;

  try {
    const result = await generateCoverArt({ trackTitle, genre });
    if (result.coverArtDataUri) {
      return {
        message: "Cover art generated successfully!",
        coverArtDataUri: result.coverArtDataUri,
      }
    }
    throw new Error("Failed to get cover art data from AI.");

  } catch (error) {
    console.error(error);
    return {
        message: "An error occurred while generating cover art.",
        errors: {
            _form: ["AI generation failed. Please try again."],
        }
    }
  }
}

export async function recommendLicensingPriceAction(
    prevState: LicensingPriceState,
    formData: FormData
): Promise<LicensingPriceState> {
    const validatedFields = licensingPriceSchema.safeParse({
        genre: formData.get("genre"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Genre is required to recommend a price.",
        };
    }

    const { genre, description } = validatedFields.data;

    try {
        const result = await recommendLicensingPrice({ genre, description });
        if (result.recommendedPrice && result.justification) {
            return {
                message: "AI price recommendation generated!",
                recommendedPrice: result.recommendedPrice,
                justification: result.justification,
            }
        }
        throw new Error("Failed to get price recommendation from AI.");
    } catch (error) {
        console.error(error);
        return {
            message: "An error occurred while recommending a price.",
            errors: {
                _form: ["AI price recommendation failed. Please try again."],
            }
        }
    }
}

export async function uploadTrackAction(
    prevState: UploadTrackState,
    formData: FormData,
): Promise<UploadTrackState> {
    
    const rawPrice = formData.get("price");
    const price = rawPrice ? Number(rawPrice) : undefined;
    
    const validatedFields = uploadTrackSchema.safeParse({
        trackTitle: formData.get("trackTitle"),
        artistId: formData.get("artistId"),
        artistName: formData.get("artistName"),
        genre: formData.get("genre"),
        description: formData.get("description"),
        coverArtDataUri: formData.get("coverArtDataUri"),
        price: price,
    });
    
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing or invalid fields. Failed to upload track.",
        };
    }

    const { trackTitle, artistId, artistName, genre, description, coverArtDataUri } = validatedFields.data;

    try {
        const { db } = await getFirebaseAdmin();
        const tracksCollection = collection(db, "tracks");
        
        // In a real app, the trackUrl would come from uploading the audio file to Cloud Storage
        const trackUrl = "https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/example-track.mp3?alt=media";
        
        await addDoc(tracksCollection, {
            title: trackTitle,
            artistId: artistId,
            artistName: artistName, // Denormalizing for easier display
            genre: genre,
            description: description,
            uploadDate: serverTimestamp(),
            coverArtUrl: coverArtDataUri, // For demo, using data URI. In prod, upload to Storage and save URL.
            trackUrl: trackUrl,
            price: price || 0,
            plays: 0,
        });

        revalidatePath('/dashboard');
        revalidatePath(`/profile/${artistId}`);
        revalidatePath('/dashboard/catalog');

        return {
            message: "Track uploaded successfully!",
        };

    } catch (error) {
        console.error(error);
        return {
            message: "An error occurred during upload.",
            errors: { _form: ["Failed to save track to database. Please try again."] }
        }
    }
}

export async function submitLicenseRequestAction(
    prevState: LicenseRequestState,
    formData: FormData
): Promise<LicenseRequestState> {
    const validatedFields = licenseRequestSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to submit request.",
        };
    }

    const { trackTitle, artistName, usageType, description, fullName, email } = validatedFields.data;

    try {
        const { db } = await getFirebaseAdmin();
        const licenseRequestsCollection = collection(db, "license_requests");

        await addDoc(licenseRequestsCollection, {
            // In a real app, you'd get trackId and requestorId from the current context/user
            // For now, we'll store the names as provided in the form
            trackTitle,
            artistName,
            usageType,
            projectDescription: description,
            requestorName: fullName,
            requestorEmail: email,
            requestDate: serverTimestamp(),
            status: "pending",
        });

        revalidatePath('/dashboard/licensing');
        return { message: "Your license request has been submitted successfully!" };
    } catch (error) {
        console.error("License request submission error:", error);
        return {
            message: "An error occurred while submitting your request.",
            errors: {
                _form: ["Could not save your request to the database. Please try again later."],
            },
        };
    }
}

export async function deleteTrackAction(trackId: string, artistId: string) {
    if (!trackId || !artistId) {
        return { error: 'Missing track or artist ID.' };
    }

    try {
        const { db } = await getFirebaseAdmin();
        await deleteDoc(doc(db, 'tracks', trackId));

        revalidatePath('/dashboard');
        revalidatePath(`/profile/${artistId}`);
        revalidatePath('/dashboard/catalog');

        return { message: 'Track deleted successfully.' };
    } catch (error) {
        console.error('Error deleting track:', error);
        return { error: 'Failed to delete track.' };
    }
}
