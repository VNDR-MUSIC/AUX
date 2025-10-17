'use server';

/**
 * @fileOverview A Genkit tool to simulate registering a musical work with a Performing Rights Organization (PRO).
 */

import {ai} from '@/ai/genkit';
import {getFirebaseAdmin} from '@/firebase/admin';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {z} from 'zod';

// Input schema for the tool
const RegisterWorkInputSchema = z.object({
  trackId: z.string().describe("The unique ID of the track to be registered."),
  pro: z.enum(['ASCAP', 'BMI', 'SESAC']).describe("The Performing Rights Organization to register with."),
});

// Output schema for the tool
const RegisterWorkOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  registrationId: z.string().optional(),
});

export const registerWorkWithPRO = ai.defineTool(
  {
    name: 'registerWorkWithPRO',
    description: "Simulates the registration of an artist's musical work with a specified Performing Rights Organization (PRO) like ASCAP, BMI, or SESAC. This is a powerful action that should only be taken when the user explicitly asks to register a specific track.",
    inputSchema: RegisterWorkInputSchema,
    outputSchema: RegisterWorkOutputSchema,
  },
  async input => {
    try {
      const {db} = await getFirebaseAdmin();
      const workRef = doc(db, 'works', input.trackId);
      const workDoc = await getDoc(workRef);

      if (!workDoc.exists()) {
        return {
            success: false,
            message: `Could not find a track with ID ${input.trackId}. I cannot register it.`,
        };
      }
      
      const workData = workDoc.data();

      // In a real application, this is where you would make an API call to the PRO's service.
      // For this simulation, we'll just log it and update our Firestore document.
      console.log(`SIMULATING: Registering track "${workData.title}" with ${input.pro}...`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API latency

      const simulatedRegistrationId = `${input.pro.slice(0,1)}${Date.now()}`;

      // Update the work document to reflect that it has been registered.
      await updateDoc(workRef, {
        proRegistration: {
          pro: input.pro,
          registrationId: simulatedRegistrationId,
          registeredAt: new Date().toISOString(),
        }
      });
      
      console.log(`SIMULATION COMPLETE: Registration ID is ${simulatedRegistrationId}`);

      return {
        success: true,
        message: `I've successfully submitted "${workData.title}" for registration with ${input.pro}. The simulated registration ID is ${simulatedRegistrationId}.`,
        registrationId: simulatedRegistrationId,
      };

    } catch (error) {
        console.error("Error registering work with PRO:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during registration.";
        return {
            success: false,
            message: `I encountered an error trying to register the work: ${errorMessage}`,
        };
    }
  }
);
