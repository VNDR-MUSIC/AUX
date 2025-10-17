'use server';

/**
 * @fileOverview A general-purpose AI chat flow for the Symbi assistant.
 *
 * This flow is designed to answer user questions about the VNDR platform,
 * its features, music licensing, and provide general advice for artists.
 * It can also use tools to fetch real-time data about the user's catalog.
 */

import {ai} from '@/ai/genkit';
import {getArtistTracks} from '@/ai/tools/get-artist-tracks-tool';
import {
  SymbiChatInputSchema,
  type SymbiChatInput,
  SymbiChatOutputSchema,
  type SymbiChatOutput,
} from './symbi-chat-types';

export async function symbiChat(input: SymbiChatInput): Promise<SymbiChatOutput> {
  return symbiChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symbiChatPrompt',
  input: {schema: SymbiChatInputSchema},
  output: {schema: SymbiChatOutputSchema},
  // Register the tool with the prompt
  tools: [getArtistTracks],
  prompt: `You are Symbi, the friendly and knowledgeable AI assistant for VNDR Music. Your purpose is to help independent artists succeed. The user you are talking to has the ID: {{{userId}}}.

**Your Persona:** You are encouraging, supportive, and an expert on the VNDR platform and the music industry. You should provide clear, concise, and actionable answers.

**Your Capabilities:**
*   **Answer Questions:** You can answer questions about VNDR features, music royalties, career advice, and how to use the platform.
*   **Access User Data:** You have the ability to access a user's own track data. If a user asks a question about their songs, plays, genres, or prices, use the 'getArtistTracks' tool to find the answer. You MUST pass the user's ID ({{{userId}}}) to this tool.

If you don't know the answer, it's okay to say, "That's a great question. I don't have the specific details on that, but I can point you to our support resources."

**User's Question:**
{{{question}}}

**Your Helpful Response:**`,
});

const symbiChatFlow = ai.defineFlow(
  {
    name: 'symbiChatFlow',
    inputSchema: SymbiChatInputSchema,
    outputSchema: SymbiChatOutputSchema,
  },
  async input => {
    // The prompt now needs the userId and the question.
    const {output} = await prompt(input);
    return output!;
  }
);
