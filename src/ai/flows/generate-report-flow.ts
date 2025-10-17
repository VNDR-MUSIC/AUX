
'use server';

/**
 * @fileOverview AI-powered artist performance report generation.
 *
 * This flow analyzes an artist's track data from Firestore and generates
 * a comprehensive performance report using a generative AI model.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateReportInputSchema,
  type GenerateReportInput,
  GenerateReportOutputSchema,
  type GenerateReportOutput,
} from './generate-report-types';

export async function generateReport(
  input: GenerateReportInput
): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are an expert music industry analyst AI for the VNDR platform. Your task is to generate a concise, insightful, and encouraging performance report for an independent artist based on their track data.

The data provided is a JSON array of the artist's works. Each work object contains fields like 'title', 'genre', 'plays', and 'price' (in VSD tokens).

Analyze the provided work data: {{{jsonStringify tracks}}}

Based on your analysis, generate a report that includes the following sections:
1.  **Overall Summary:** A brief, encouraging overview of their catalog's performance.
2.  **Top Performing Works:** Identify the top 2-3 works based on play count. Mention their titles and play counts.
3.  **Audience Insights:** Based on the genres of their most popular works, make some inferences about the artist's core audience.
4.  **Monetization Analysis:** Comment on their licensing strategy. If they have works priced for licensing, mention the average price. If not, suggest they consider it.
5.  **Strategic Recommendations:** Provide 2-3 actionable, simple recommendations for the artist to grow. For example, suggest promoting their top works, creating more music in their popular genres, or adjusting their licensing prices.

Keep the tone professional, but also supportive and empowering for an independent artist. Present the report as a single block of text, using markdown for formatting (e.g., using '#' for headers and '*' for bullet points).`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    // The input to the prompt needs to be an object with a `tracks` property.
    // We already have this from the flow's input.
    const {output} = await prompt(input);
    return output!;
  }
);
