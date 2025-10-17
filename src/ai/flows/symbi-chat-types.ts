import {z} from 'genkit';

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

export const SymbiChatInputSchema = z.object({
    userId: z.string().describe("The ID of the user asking the question."),
    question: z.string().describe("The user's current question for the Symbi AI assistant."),
    history: z.array(MessageSchema).optional().describe("The history of the conversation so far."),
});
export type SymbiChatInput = z.infer<typeof SymbiChatInputSchema>;

export const SymbiChatOutputSchema = z.string().describe("The AI's helpful and informative response.");
export type SymbiChatOutput = z.infer<typeof SymbiChatOutputSchema>;
