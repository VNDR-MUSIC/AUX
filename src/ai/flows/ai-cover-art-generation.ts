
'use server';

/**
 * @fileOverview Generates AI cover art based on track genre and title.
 *
 * - generateCoverArt - A function that generates cover art.
 * - CoverArtInput - The input type for the generateCoverArt function.
 * - CoverArtOutput - The return type for the generateCoverArt function.
 */

import {ai} from '@/ai/genkit';
import {
  CoverArtInputSchema,
  type CoverArtInput,
  CoverArtOutputSchema,
  type CoverArtOutput,
} from './ai-cover-art-generation-types';

export async function generateCoverArt(input: CoverArtInput): Promise<CoverArtOutput> {
  return generateCoverArtFlow(input);
}

const generateCoverArtFlow = ai.defineFlow(
  {
    name: 'generateCoverArtFlow',
    inputSchema: CoverArtInputSchema,
    outputSchema: CoverArtOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Create a square album cover art for a song titled "${input.trackTitle}" in the style of ${input.genre} music. The image should be vibrant, professional, and evocative of the genre. Do not include any text or logos on the image.`,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate cover art.');
    }

    return {coverArtDataUri: media.url};
  }
);
