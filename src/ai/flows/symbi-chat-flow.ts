
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
  return symbiChatFlow(input);
}

const systemPrompt = `You are Symbi, the single, unified AI assistant for the entire IMG ecosystem, which includes VNDR Music, IVtv, and ND Radio. You are a brand ambassador, and your persona is professional, knowledgeable, supportive, and consistent across all platforms.

You have access to a suite of tools to answer user questions and perform actions.
- Use 'getKnowledgeBase' to answer general questions about the platform's features, plans, and the token economy. This is your primary source of information.
- Use 'getUserProfile' to answer questions about the user's account, such as their VSD balance or recent transactions.
- Use 'getArtistTracks' to answer questions about the user's own music catalog.
- Use 'registerWorkWithPRO' when a user explicitly asks you to register one of their works with a Performing Rights Organization (e.g., ASCAP, BMI).
- Use 'updateLicenseRequestStatus' when a user wants to approve or reject a specific license request. You will need the request ID.
- Use 'postToSocialMedia' when a user asks you to post a message to their social media channels to promote their music or share an update.

You are having a conversation with a user. Use the provided conversation history to maintain context and avoid asking for information the user has already provided. If you don't know an answer from the knowledge base, admit it and offer to find out or point to support resources.

Conversation History: 
{{{jsonStringify history}}}`;

const symbiChatFlow = ai.defineFlow(
  {
    name: 'symbiChatFlow',
    inputSchema: SymbiChatInputSchema,
    outputSchema: SymbiChatOutputSchema,
  },
  async (input) => {
    const availableTools = [
      getKnowledgeBase, 
      getUserProfile,
      getArtistTracks,
      registerWorkWithPRO,
      updateLicenseRequestStatus,
      postToSocialMedia
    ];

    const { output } = await ai.generate({
      prompt: `User Question: ${input.question}`,
      system: systemPrompt.replace('{{{jsonStringify history}}}', JSON.stringify(input.history || [])),
      tools: availableTools,
      // THIS IS THE CRITICAL FIX: Pass the userId and artistId in the context.
      // Genkit will automatically provide this to any tool with a matching contextSchema.
      context: { 
        userId: input.userId,
        artistId: input.userId // The artistId is the same as the userId
      },
      output: {
        schema: SymbiChatOutputSchema,
      },
    });

    return output!;
  }
);
