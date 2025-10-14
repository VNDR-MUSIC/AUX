
import {z} from 'genkit';

/**
 * Input schema for the AI-powered music recommendations flow.
 */
export const AIPoweredRecommendationsInputSchema = z.object({
  listeningHistory: z
    .string()
    .describe("The listener's music listening history."),
});

/**
 * Type definition for the input of the AI-powered music recommendations flow.
 */
export type AIPoweredRecommendationsInput = z.infer<
  typeof AIPoweredRecommendationsInputSchema
>;

/**
 * Output schema for the AI-powered music recommendations flow.
 */
export const AIPoweredRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of personalized music recommendations.'),
});

/**
 * Type definition for the output of the AI-powered music recommendations flow.
 */
export type AIPoweredRecommendationsOutput = z.infer<
  typeof AIPoweredRecommendationsOutputSchema
>;
