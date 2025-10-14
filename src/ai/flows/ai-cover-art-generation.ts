
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

const prompt = ai.definePrompt({
  name: 'generateCoverArtPrompt',
  input: {schema: CoverArtInputSchema},
  output: {schema: CoverArtOutputSchema},
  prompt: `Generate cover art for a music track with the following characteristics:\n\nTitle: {{{trackTitle}}}\nGenre: {{{genre}}}\n\nCreate visually appealing cover art that reflects the music's style. Return the image as a data URI.
`,
});

const generateCoverArtFlow = ai.defineFlow(
  {
    name: 'generateCoverArtFlow',
    inputSchema: CoverArtInputSchema,
    outputSchema: CoverArtOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Create a cover art image for a song titled "${input.trackTitle}" in the style of ${input.genre} music.`,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate cover art.');
    }

    return {coverArtDataUri: media.url};
  }
);
