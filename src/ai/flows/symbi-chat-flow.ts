
'use server';

/**
 * @fileOverview A general-purpose AI chat flow for the Symbi assistant.
 *
 * This flow is designed to answer user questions about the VNDR platform,
 * its features, music licensing, and provide general advice for artists.
 * It can also use tools to fetch real-time data about the user's profile.
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
import { z } from 'zod';

export async function symbiChat(input: SymbiChatInput): Promise<SymbiChatOutput> {
  return symbiChatFlow(input);
}

const systemPrompt = `You are Symbi, the single, unified AI assistant for the entire IMG ecosystem, which includes VNDR Music, IVtv, and ND Radio. You are a brand ambassador, and your persona is professional, knowledgeable, supportive, and consistent across all platforms.

Your primary source of information about the platform's features, plans, and token economy is the Knowledge Base provided below. Refer to it to answer user questions.

You are aware of the user you are talking to. You have access to their user profile information, including their VSD balance and recent transactions, which you should use to provide personalized and context-aware responses.

Your Core Capabilities:
- Answer questions about any IMG platform (VNDR, IVtv, ND Radio) using the provided Knowledge Base.
- Access user data to provide personalized information.
- Maintain a consistent, helpful, and professional tone.
- If you don't know an answer, admit it and offer to find out or point to support resources.

User Context:
- User Profile: {{{jsonStringify userProfile}}}
- Conversation History: {{{jsonStringify history}}}

Knowledge Base:
---
{{{knowledgeBase}}}
---

Based on all this context, provide a helpful response to the user's latest question.`;

const symbiChatFlow = ai.defineFlow(
  {
    name: 'symbiChatFlow',
    inputSchema: SymbiChatInputSchema,
    outputSchema: SymbiChatOutputSchema,
  },
  async input => {
    // 1. Fetch contextual data in parallel.
    const [userProfile, knowledgeBase] = await Promise.all([
      getUserProfile({ userId: input.userId }),
      getKnowledgeBase({})
    ]);

    // 2. Define the prompt with all available context.
    const prompt = ai.definePrompt({
        name: 'symbiChatPrompt',
        system: systemPrompt,
        // The AI can still use tools if needed for more specific, real-time data.
        tools: [getUserProfile], 
        input: {
            schema: z.object({
                userProfile: z.any(),
                history: z.any(),
                question: z.string(),
                knowledgeBase: z.string(),
            })
        },
        output: { schema: SymbiChatOutputSchema },
        prompt: 'User Question: {{{question}}}'
    });

    // 3. Invoke the prompt with the rich context.
    const {output} = await prompt({
        userProfile,
        knowledgeBase,
        history: input.history || [],
        question: input.question,
    });

    return output!;
  }
);
