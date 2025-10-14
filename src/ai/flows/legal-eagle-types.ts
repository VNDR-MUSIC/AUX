
import {z} from 'genkit';

export const LegalEagleInputSchema = z.object({
  userId: z.string().describe("The ID of the user asking the question."),
  question: z.string().describe("The user's question for the simulated legal adviser."),
});
export type LegalEagleInput = z.infer<typeof LegalEagleInputSchema>;

export const LegalEagleOutputSchema = z.string().describe("The AI's response, framed as a simulated entertainment attorney.");
export type LegalEagleOutput = z.infer<typeof LegalEagleOutputSchema>;
