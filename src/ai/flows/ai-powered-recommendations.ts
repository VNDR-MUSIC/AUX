
'use server';

/**
 * @fileOverview AI-powered music recommendations flow.
 *
 * This file defines a Genkit flow that suggests personalized music recommendations
 * based on a listener's listening history.
 *
 * @module src/ai/flows/ai-powered-recommendations
 *
 * @interface AIPoweredRecommendationsInput - The input type for the aiPoweredRecommendations function.
 * @interface AIPoweredRecommendationsOutput - The output type for the aiPoweredRecommendations function.
 * @function aiPoweredRecommendations - A function that generates personalized music recommendations.
 */

import {ai} from '@/ai/genkit';
import {
  AIPoweredRecommendationsInputSchema,
  type AIPoweredRecommendationsInput,
  AIPoweredRecommendationsOutputSchema,
  type AIPoweredRecommendationsOutput,
} from './ai-powered-recommendations-types';

/**
 * Asynchronously generates personalized music recommendations based on the
 * provided listening history.
 *
 * @param input - An object containing the listener's listening history.
 * @returns A promise that resolves to an object containing the music
 * recommendations.
 */
export async function aiPoweredRecommendations(
  input: AIPoweredRecommendationsInput
): Promise<AIPoweredRecommendationsOutput> {
  return aiPoweredRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredRecommendationsPrompt',
  input: {schema: AIPoweredRecommendationsInputSchema},
  output: {schema: AIPoweredRecommendationsOutputSchema},
  prompt: `Based on the user's listening history: {{{listeningHistory}}}, what personalized music recommendations would you provide?`,
});

const aiPoweredRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiPoweredRecommendationsFlow',
    inputSchema: AIPoweredRecommendationsInputSchema,
    outputSchema: AIPoweredRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
