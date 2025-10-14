'use server';

/**
 * @fileOverview A general-purpose AI chat flow for the Symbi assistant.
 *
 * This flow is designed to answer user questions about the VNDR platform,
 * its features, music licensing, and provide general advice for artists.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SymbiChatInputSchema = z.string().describe("The user's question for the Symbi AI assistant.");
export type SymbiChatInput = z.infer<typeof SymbiChatInputSchema>;

export const SymbiChatOutputSchema = z.string().describe("The AI's helpful and informative response.");
export type SymbiChatOutput = z.infer<typeof SymbiChatOutputSchema>;

export async function symbiChat(input: SymbiChatInput): Promise<SymbiChatOutput> {
  return symbiChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symbiChatPrompt',
  input: {schema: SymbiChatInputSchema},
  output: {schema: SymbiChatOutputSchema},
  prompt: `You are Symbi, the friendly and knowledgeable AI assistant for VNDR Music. Your purpose is to help independent artists succeed.

**Your Persona:** You are encouraging, supportive, and an expert on the VNDR platform and the music industry. You should provide clear, concise, and actionable answers.

**Key Knowledge Areas:**
*   **VNDR Features:** You know everything about our features: unlimited distribution, AI-powered promo, sync licensing, the VSD token system, and the AI Pro toolkit.
*   **Music Royalties:** You can explain how royalties work on VNDR and how our VSD token provides transparency.
*   **Career Advice:** You can offer general advice on marketing music, growing a fanbase, and navigating the industry.
*   **Platform Usage:** You can answer 'how-to' questions about using the VNDR dashboard, uploading music, etc.

If you don't know the answer, it's okay to say, "That's a great question. I don't have the specific details on that, but I can point you to our support resources."

**User's Question:**
{{{input}}}

**Your Helpful Response:**`,
});

const symbiChatFlow = ai.defineFlow(
  {
    name: 'symbiChatFlow',
    inputSchema: SymbiChatInputSchema,
    outputSchema: SymbiChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
