
import {z} from 'genkit';
import { TrackSchema } from '@/store/music-player-store';

/**
 * Input schema for the AI-powered report generation flow.
 */
export const GenerateReportInputSchema = z.object({
  tracks: z.array(TrackSchema).describe("An array of the artist's work objects."),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

/**
 * Output schema for the AI-powered report generation flow.
 */
export const GenerateReportOutputSchema = z.object({
  report: z
    .string()
    .describe('The full, formatted performance report as a single string.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;
