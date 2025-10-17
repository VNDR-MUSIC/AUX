
'use server';

/**
 * @fileOverview AI-powered licensing price recommendation flow.
 *
 * This file defines a Genkit flow that suggests a licensing price for a music
 * track based on its genre and description.
 */

import {ai} from '@/ai/genkit';
import {
  LicensingPriceInputSchema,
  type LicensingPriceInput,
  LicensingPriceOutputSchema,
  type LicensingPriceOutput,
} from './ai-licensing-price-recommendation-types';

export async function recommendLicensingPrice(
  input: LicensingPriceInput
): Promise<LicensingPriceOutput> {
  return recommendLicensingPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendLicensingPricePrompt',
  input: {schema: LicensingPriceInputSchema},
  output: {schema: LicensingPriceOutputSchema},
  prompt: `You are an expert in music licensing for indie artists on the VNDR platform. Based on the following track details, recommend a fair and competitive licensing price in VSD tokens. The platform is for indie artists, so the price should be accessible but still reflect the value of the work. VSD tokens are roughly equivalent to USD cents, so 1000 VSD is about $10. A typical indie license might range from 2500 to 10000 VSD ($25-$100).

Genre: {{{genre}}}
Description: {{{description}}}

Provide a brief justification for your recommendation, considering factors like genre popularity, potential use cases (e.g., YouTube background music vs. film scene), and market standards for indie music. Return the price as a number (e.g., 5000) and the justification as a string.`,
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
