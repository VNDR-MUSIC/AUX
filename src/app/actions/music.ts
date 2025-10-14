"use server";

import { z } from "zod";
import { generateCoverArt } from "@/ai/flows/ai-cover-art-generation";

const schema = z.object({
  trackTitle: z.string().min(1, "Track title is required."),
  genre: z.string().min(1, "Genre is required."),
});

type State = {
  message?: string | null;
  coverArtDataUri?: string | null;
  errors?: {
    trackTitle?: string[];
    genre?: string[];
    _form?: string[];
  }
}

export async function generateCoverArtAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = schema.safeParse({
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
