"use server";

import { z } from "zod";
import { generateCoverArt } from "@/ai/flows/ai-cover-art-generation";
import { recommendLicensingPrice } from "@/ai/flows/ai-licensing-price-recommendation";

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
