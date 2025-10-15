
'use server';

import { ai } from '@/ai/genkit';
import { getFirebaseAdmin } from '@/firebase/admin';
import { trackPlays } from '@/app/actions/music';
import { collection, query, where, getDocs } from 'firebase/firestore';
import fetch from 'node-fetch';

let lastTrackId = '';

interface RadioLizeNowPlaying {
  station: {
    id: number;
    name: string;
  };
  now_playing: {
    song: {
      id: string;
      text: string;
      artist: string;
      title: string;
      album: string;
      lyrics: string;
      art: string;
    };
  };
}

async function getNowPlaying(): Promise<RadioLizeNowPlaying | null> {
  const url = process.env.RADIOLIZE_API_URL;
  const apiKey = process.env.RADIOLIZE_API_KEY;

  if (!url || !apiKey) {
    console.error('RadioLize API URL or Key is not configured.');
    return null;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      console.error(`RadioLize API request failed with status: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as RadioLizeNowPlaying;
    return data;
  } catch (error) {
    console.error('Error fetching data from RadioLize API:', error);
    return null;
  }
}

async function findAndIncrementTrack(artist: string, title: string) {
  console.log(`Searching for track: ${title} by ${artist}`);
  const { db } = await getFirebaseAdmin();
  const tracksRef = collection(db, 'tracks');

  // Firestore queries are case-sensitive. We can't do a lowercase search directly.
  // We'll fetch potential matches and then filter in memory.
  const q = query(tracksRef, where('artistName', '==', artist));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log(`No tracks found for artist: ${artist}`);
      return;
    }

    const trackDoc = querySnapshot.docs.find(
      (doc) => doc.data().title.toLowerCase() === title.toLowerCase()
    );

    if (trackDoc) {
      console.log(`Track found! ID: ${trackDoc.id}. Incrementing play count.`);
      await trackPlays(trackDoc.id);
    } else {
      console.log(`Found artist ${artist}, but no track titled "${title}".`);
    }
  } catch (error) {
    console.error('Error querying Firestore for track:', error);
  }
}

export const radiolizePollingFlow = ai.defineFlow(
  {
    name: 'radiolizePollingFlow',
    // This flow runs on a schedule, so it doesn't need input/output schemas.
  },
  async () => {
    console.log('Polling RadioLize for now playing track...');
    const nowPlaying = await getNowPlaying();

    if (nowPlaying && nowPlaying.now_playing) {
      const { song } = nowPlaying.now_playing;
      const currentTrackId = song.id;

      if (currentTrackId && currentTrackId !== lastTrackId) {
        console.log(`New track detected: ${song.title} by ${song.artist}`);
        lastTrackId = currentTrackId;

        // The song text is often "Artist - Title", so we split it.
        const parts = song.text.split(' - ');
        const artist = song.artist || parts[0]?.trim();
        const title = song.title || parts[1]?.trim();

        if (artist && title) {
          await findAndIncrementTrack(artist, title);
        } else {
          console.log(`Could not parse artist and title from: ${song.text}`);
        }
      } else {
         console.log(`Same track is playing or no track detected. ID: ${currentTrackId}`);
      }
    }
     return { success: true };
  }
);


// This is a simple implementation of a polling mechanism.
// In a real production app, you might use a more robust scheduling system or webhooks if available.
setInterval(() => {
    radiolizePollingFlow();
}, 30000); // Poll every 30 seconds
