
'use server';

/**
 * @fileOverview A general-purpose AI chat flow for the Symbi assistant.
 *
 * This flow is designed to answer user questions about the VNDR platform,
 * its features, music licensing, and provide general advice for artists.
 * It can also use tools to fetch real-time data about the user's profile
 * and perform actions on their behalf.
 */

import {ai} from '@/ai/genkit';
import {
  SymbiChatInputSchema,
  type SymbiChatInput,
  SymbiChatOutputSchema,
  type SymbiChatOutput,
} from './symbi-chat-types';
import { getUserProfile } from '../tools/get-user-profile-tool';
import { getKnowledgeBase } from '../tools/get-knowledge-base-tool';
import { getArtistTracks } from '../tools/get-artist-tracks-tool';
import { registerWorkWithPRO } from '../tools/register-work-with-pro-tool';
import { updateLicenseRequestStatus } from '../tools/update-license-request-status-tool';
import { postToSocialMedia } from '../tools/post-to-social-media-tool';
import { z } from 'zod';

export async function symbiChat(input: SymbiChatInput): Promise<SymbiChatOutput> {
  // We pass the artistId to the flow so it can be used by tools if needed.
  return symbiChatFlow({
    ...input,
    artistId: input.userId,
  });
}

const systemPrompt = `You are Symbi, the single, unified AI assistant for the entire IMG ecosystem, which includes VNDR Music, IVtv, and ND Radio. You are a brand ambassador, and your persona is professional, knowledgeable, supportive, and consistent across all platforms.

You have access to a suite of tools to answer user questions and perform actions.
- Use 'getKnowledgeBase' to answer general questions about the platform's features, plans, and token economy.
- Use 'getUserProfile' to answer questions about the user's account, like their VSD balance or recent transactions.
- Use 'getArtistTracks' to answer questions about the user's music catalog, like play counts or their most popular songs.
- Use 'registerWorkWithPRO' when a user explicitly asks you to register one of their works with a Performing Rights Organization (e.g., ASCAP, BMI).
- Use 'updateLicenseRequestStatus' when a user wants to approve or reject a specific license request. You will need the request ID.
- Use 'postToSocialMedia' when a user asks you to post a message to their social media channels to promote their music or share an update.

You are having a conversation with a user. Use the provided conversation history to maintain context and avoid asking for information the user has already provided. If you don't know an answer, admit it and offer to find out or point to support resources.

Conversation History: 
{{{jsonStringify history}}}`;

// 1. Define the prompt at the top level, making tools available for the AI to use.
const symbiPrompt = ai.definePrompt({
  name: 'symbiChatPrompt',
  system: systemPrompt,
  tools: [getKnowledgeBase, getUserProfile, getArtistTracks, registerWorkWithPRO, updateLicenseRequestStatus, postToSocialMedia],
  input: {
    schema: z.object({
      history: z.any(),
      question: z.string(),
    }),
  },
  output: { schema: SymbiChatOutputSchema },
  prompt: 'User Question: {{{question}}}',
});


const symbiChatFlow = ai.defineFlow(
  {
    name: 'symbiChatFlow',
    // The flow now also accepts artistId for the tools.
    inputSchema: SymbiChatInputSchema.extend({ artistId: z.string() }),
    outputSchema: SymbiChatOutputSchema,
  },
  async (input) => {
    // 2. Invoke the pre-defined prompt with the user's question and history.
    // The AI will decide if it needs to call any tools.
    // The input to the prompt MUST match its defined input schema.
    const { output } = await symbiPrompt({
      history: input.history || [],
      question: input.question,
    });

    return output!;
  }
);
