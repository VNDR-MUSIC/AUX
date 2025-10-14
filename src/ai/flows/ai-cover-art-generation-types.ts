
import {z} from 'genkit';

export const CoverArtInputSchema = z.object({
  trackTitle: z.string().describe('The title of the music track.'),
  genre: z.string().describe('The genre of the music track.'),
});
export type CoverArtInput = z.infer<typeof CoverArtInputSchema>;

export const CoverArtOutputSchema = z.object({
  coverArtDataUri: z
    .string()
    .describe(
      'The generated cover art as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type CoverArtOutput = z.infer<typeof CoverArtOutputSchema>;
