import {z} from 'genkit';

export const SymbiChatInputSchema = z.string().describe("The user's question for the Symbi AI assistant.");
export type SymbiChatInput = z.infer<typeof SymbiChatInputSchema>;

export const SymbiChatOutputSchema = z.string().describe("The AI's helpful and informative response.");
export type SymbiChatOutput = z.infer<typeof SymbiChatOutputSchema>;
