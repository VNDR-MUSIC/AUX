'use server';

/**
 * @fileOverview Generates AI cover art based on track genre and title.
 *
 * - generateCoverArt - A function that generates cover art.
 * - CoverArtInput - The input type for the generateCoverArt function.
 * - CoverArtOutput - The return type for the generateCoverArt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoverArtInputSchema = z.object({
  trackTitle: z.string().describe('The title of the music track.'),
  genre: z.string().describe('The genre of the music track.'),
});
export type CoverArtInput = z.infer<typeof CoverArtInputSchema>;

const CoverArtOutputSchema = z.object({
  coverArtDataUri: z
    .string()
    .describe(
      'The generated cover art as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type CoverArtOutput = z.infer<typeof CoverArtOutputSchema>;

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
