
'use server';

/**
 * @fileOverview A Genkit tool for fetching an artist's tracks from Firestore.
 */

import {ai} from '@/ai/genkit';
import {getFirebaseAdmin} from '@/firebase/admin';
import {collection, query, where, getDocs, Timestamp} from 'firebase/firestore';
import {z} from 'zod';

// Input schema for the tool - no longer needs artistId here
const ArtistTracksInputSchema = z.object({});

// Output schema for the tool
const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  genre: z.string(),
  uploadDate: z.string(),
  plays: z.number().optional(),
  price: z.number().optional(),
});

const ArtistTracksOutputSchema = z.array(TrackSchema);

export const getArtistTracks = ai.defineTool(
  {
    name: 'getArtistTracks',
    description: "Retrieves a list of all tracks uploaded by the current user, including their title, genre, play count, and licensing price. Use this to answer questions about the user's own music catalog.",
    inputSchema: ArtistTracksInputSchema,
    outputSchema: ArtistTracksOutputSchema,
    contextSchema: z.object({ artistId: z.string() })
  },
  async (input, context) => {
    try {
      const {db} = await getFirebaseAdmin();
      const artistId = context.artistId;
      
      if (!artistId) {
        throw new Error("Artist ID is missing from the context.");
      }

      const tracksRef = collection(db, 'works');
      const q = query(tracksRef, where('artistId', '==', artistId));
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return [];
      }
      
      const tracks = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const uploadDate = data.uploadDate;
        // Convert timestamp to ISO string
        const dateString = uploadDate instanceof Timestamp ? uploadDate.toDate().toISOString() : new Date().toISOString();

        return {
          id: doc.id,
          title: data.title || '',
          genre: data.genre || '',
          uploadDate: dateString,
          plays: data.plays || 0,
          price: data.price || 0,
        };
      });

      return tracks;
    } catch (error) {
        console.error("Error fetching artist tracks:", error);
        // It's often better to return an empty array or a user-friendly error message
        // than to let the whole flow fail. The LLM can then report that it couldn't fetch the data.
        return [];
    }
  }
);
