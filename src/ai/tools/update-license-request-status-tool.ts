
'use server';

/**
 * @fileOverview A Genkit tool for an artist to approve or reject a license request.
 */

import {ai} from '@/ai/genkit';
import {getFirebaseAdmin} from '@/firebase/admin';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {z} from 'zod';

// Input schema for the tool
const UpdateLicenseRequestInputSchema = z.object({
  licenseRequestId: z.string().describe("The unique ID of the license request to update."),
  status: z.enum(['approved', 'rejected']).describe("The new status for the license request."),
});

// Output schema for the tool
const UpdateLicenseRequestOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const updateLicenseRequestStatus = ai.defineTool(
  {
    name: 'updateLicenseRequestStatus',
    description: "Updates the status of a music license request to either 'approved' or 'rejected'. This action can only be performed by the artist who owns the track. Use this when a user wants to accept or decline a licensing offer.",
    inputSchema: UpdateLicenseRequestInputSchema,
    outputSchema: UpdateLicenseRequestOutputSchema,
    // Add context schema for artistId
    contextSchema: z.object({ artistId: z.string() })
  },
  async (input, context) => { // context is now available
    try {
      const {db} = await getFirebaseAdmin();
      const requestRef = doc(db, 'license_requests', input.licenseRequestId);
      const requestDoc = await getDoc(requestRef);

      if (!requestDoc.exists()) {
        return {
            success: false,
            message: `I could not find a license request with ID ${input.licenseRequestId}.`,
        };
      }
      
      const requestData = requestDoc.data();
      const artistId = context.artistId;

      // Security Check: Ensure the user performing the action owns the request.
      if (requestData.artistId !== artistId) {
        return {
            success: false,
            message: "I can't perform this action. You are not the owner of the track associated with this license request.",
        };
      }
      
      // Update the Firestore document
      await updateDoc(requestRef, { status: input.status });

      return {
        success: true,
        message: `I have successfully updated the status of the request for "${requestData.trackTitle}" to '${input.status}'.`,
      };

    } catch (error) {
        console.error("Error updating license request:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return {
            success: false,
            message: `I encountered an error trying to update the license request: ${errorMessage}`,
        };
    }
  }
);
