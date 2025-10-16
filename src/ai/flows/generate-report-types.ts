
import {z} from 'genkit';

const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artistId: z.string(),
  artistName: z.string(),
  genre: z.string(),
  plays: z.number().optional(),
  price: z.number().optional(),
  // Add other relevant fields from your Track entity if needed
});

/**
 * Input schema for the AI-powered report generation flow.
 */
export const GenerateReportInputSchema = z.object({
  tracks: z.array(TrackSchema).describe("An array of the artist's track objects."),
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
