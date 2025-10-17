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
import { getUserProfile } from '../tools/get-user-profile-tool';
import { z } from 'zod';

export async function symbiChat(input: SymbiChatInput): Promise<SymbiChatOutput> {
  return symbiChatFlow(input);
}

const systemPrompt = `You are Symbi, the single, unified AI assistant for the entire IMG ecosystem, which includes VNDR Music, IVtv, and ND Radio. You are a brand ambassador, and your persona is professional, knowledgeable, supportive, and consistent across all platforms.

You are aware of the user you are talking to, and you remember conversations with them across different websites. You have access to their user profile information, including their VSD balance and recent transactions, which you should use to provide personalized and context-aware responses.

Your Core Capabilities:
- Answer questions about any IMG platform (VNDR, IVtv, ND Radio).
- Access user data to provide personalized information. Use the 'getArtistTracks' tool to answer questions about a user's music catalog.
- Maintain a consistent, helpful, and professional tone.
- If you don't know an answer, admit it and offer to find out or point to support resources.

User Context:
- User Profile: {{{jsonStringify userProfile}}}
- Conversation History: {{{jsonStringify history}}}

Based on this, provide a helpful response to the user's latest question.`;

const symbiChatFlow = ai.defineFlow(
  {
    name: 'symbiChatFlow',
    inputSchema: SymbiChatInputSchema,
    outputSchema: SymbiChatOutputSchema,
  },
  async input => {
    // 1. Fetch the user's full profile data, including VSD balance and transactions.
    const userProfile = await getUserProfile({ userId: input.userId });

    // 2. Define the prompt with all available context.
    const prompt = ai.definePrompt({
        name: 'symbiChatPrompt',
        system: systemPrompt,
        // Available tools for the LLM to use
        tools: [getArtistTracks, getUserProfile], 
        // We pass the full context object to the prompt.
        // The handlebars in the system prompt will access these properties.
        input: {
            schema: z.object({
                userProfile: z.any(),
                history: z.any(),
                question: z.string(),
            })
        },
        output: { schema: SymbiChatOutputSchema },
        // The main prompt is now just the user's immediate question.
        prompt: 'User Question: {{{question}}}'
    });

    // 3. Invoke the prompt with the rich context.
    const {output} = await prompt({
        userProfile,
        history: input.history || [],
        question: input.question,
    });

    return output!;
  }
);
