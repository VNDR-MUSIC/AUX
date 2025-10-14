
import {z} from 'genkit';

export const MusoPartnershipInputSchema = z.string().describe('The user\'s query or question about the VNDR and Muso.AI partnership.');
export type MusoPartnershipInput = z.infer<typeof MusoPartnershipInputSchema>;

export const MusoPartnershipOutputSchema = z.string().describe('The AI\'s response to the user\'s query.');
export type MusoPartnershipOutput = z.infer<typeof MusoPartnershipOutputSchema>;
