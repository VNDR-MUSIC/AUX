
import {z} from 'genkit';

/**
 * Input schema for the AI-powered licensing price recommendation flow.
 */
export const LicensingPriceInputSchema = z.object({
  genre: z.string().describe('The genre of the music track.'),
  description: z.string().optional().describe('A description of the music track.'),
});
export type LicensingPriceInput = z.infer<typeof LicensingPriceInputSchema>;

/**
 * Output schema for the AI-powered licensing price recommendation flow.
 */
export const LicensingPriceOutputSchema = z.object({
  recommendedPrice: z
    .number()
    .describe('The recommended licensing price in VSD tokens.'),
  justification: z
    .string()
    .describe('A brief justification for the recommended price.'),
});
export type LicensingPriceOutput = z.infer<typeof LicensingPriceOutputSchema>;
