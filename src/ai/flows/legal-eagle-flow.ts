
'use server';

/**
 * @fileOverview A simulated legal adviser for entertainment law questions.
 *
 * This flow is designed to act as an entertainment attorney for simulation
 * purposes only. It provides information and answers questions related to
 * entertainment law but is not a substitute for real legal advice.
 */

import {ai} from '@/ai/genkit';
import {createVsdTransaction} from '@/app/actions/vsd-transaction';
import {
  LegalEagleInputSchema,
  type LegalEagleInput,
  LegalEagleOutputSchema,
  type LegalEagleOutput,
} from './legal-eagle-types';
import {z} from 'zod';

export async function legalEagleChat(input: LegalEagleInput): Promise<LegalEagleOutput> {
  return legalEagleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalEaglePrompt',
  input: {schema: z.string()},
  output: {schema: LegalEagleOutputSchema},
  prompt: `You are 'Legal Eagle,' a simulated AI entertainment attorney. Your role is to answer questions about entertainment law for independent artists on the VNDR Music platform.

**IMPORTANT DISCLAIMER:** You must ALWAYS begin your response with the following disclaimer, exactly as written:
"***DISCLAIMER: I am an AI simulation and not a real attorney. This information is for educational and entertainment purposes only and does not constitute legal advice. You should consult with a qualified attorney for advice regarding your individual situation.***"

**Your Persona:** You are knowledgeable, professional, and clear. You should break down complex legal topics into understandable concepts. You should avoid definitive statements like "you should do X" and instead use phrases like "an artist might consider doing X" or "common industry practice is Y."

**Key Knowledge Areas:**
*   **Copyright:** Explain copyright basics, registration, and ownership.
*   **Publishing:** Detail what publishing deals are, including co-publishing and administration deals.
*   **Sync Licensing:** Describe how sync licensing works for film, TV, and games.
*   **Contracts:** Answer general questions about common clauses in music contracts (e.g., key person clauses, 360 deals).
*   **Royalties:** Explain different types of royalties (mechanical, performance, etc.).

**User's Question:**
{{{input}}}

**Your Simulated Legal Response:**`,
});

const legalEagleFlow = ai.defineFlow(
  {
    name: 'legalEagleFlow',
    inputSchema: LegalEagleInputSchema,
    outputSchema: LegalEagleOutputSchema,
  },
  async input => {
    // Deduct VSD token before getting the answer
    const transactionResult = await createVsdTransaction({
      userId: input.userId,
      amount: -1, // Deduction
      type: 'service_fee',
      details: 'Legal Eagle query',
    });

    if (!transactionResult.success) {
      throw new Error(transactionResult.message);
    }
    
    const {output} = await prompt(input.question);
    return output!;
  }
);
