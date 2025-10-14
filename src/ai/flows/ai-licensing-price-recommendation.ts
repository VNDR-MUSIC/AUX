'use server';

/**
 * @fileOverview AI-powered licensing price recommendation flow.
 *
 * This file defines a Genkit flow that suggests a licensing price for a music
 * track based on its genre and description.
 */

import {ai} from '@/ai/genkit';
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

export async function recommendLicensingPrice(
  input: LicensingPriceInput
): Promise<LicensingPriceOutput> {
  return recommendLicensingPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendLicensingPricePrompt',
  input: {schema: LicensingPriceInputSchema},
  output: {schema: LicensingPriceOutputSchema},
  prompt: `You are an expert in music licensing for indie artists. Based on the following track details, recommend a fair and competitive licensing price in VSD tokens. The platform is for indie artists, so the price should be accessible but still reflect the value of the work.

Genre: {{{genre}}}
Description: {{{description}}}

Provide a brief justification for your recommendation, considering factors like genre popularity, potential use cases, and market standards for indie music. Return the price as a number and the justification as a string.`,
});

const recommendLicensingPriceFlow = ai.defineFlow(
  {
    name: 'recommendLicensingPriceFlow',
    inputSchema: LicensingPriceInputSchema,
    outputSchema: LicensingPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
