
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
  // In a real app, this would be in an environment variable.
  // We use a mock URL for demonstration.
  const url = 'https://demo.azuracast.com/api/nowplaying/1';
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Radio API request failed with status: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as RadioLizeNowPlaying;
    return data;
  } catch (error) {
    console.error('Error fetching data from Radio API:', error);
    return null;
  }
}

async function findAndIncrementTrack(artist: string, title: string) {
  console.log(`Searching for track: ${title} by ${artist}`);
  const { db } = await getFirebaseAdmin();
  const worksRef = collection(db, 'works');

  // Firestore queries are case-sensitive. We often have to fetch and filter.
  // This is a simplification. A more robust solution might use a search service
  // or store normalized fields.
  const q = query(worksRef, where('artistName', '==', artist));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log(`No works found for artist: ${artist}`);
      return;
    }

    const trackDoc = querySnapshot.docs.find(
      (doc) => doc.data().title.toLowerCase() === title.toLowerCase()
    );

    if (trackDoc) {
      console.log(`Track found! ID: ${trackDoc.id}. Incrementing play count.`);
      await trackPlays(trackDoc.id);
    } else {
      console.log(`Found artist ${artist}, but no work titled "${title}".`);
    }
  } catch (error) {
    console.error('Error querying Firestore for work:', error);
  }
}

export const radiolizePollingFlow = ai.defineFlow(
  {
    name: 'radiolizePollingFlow',
    // This flow runs on a schedule, so it doesn't need input/output schemas.
  },
  async () => {
    console.log('Polling Radio for now playing track...');
    const nowPlaying = await getNowPlaying();

    if (nowPlaying && nowPlaying.now_playing) {
      const { song } = nowPlaying.now_playing;
      const currentTrackId = song.id;

      if (currentTrackId && currentTrackId !== lastTrackId) {
        console.log(`New track detected: ${song.title} by ${song.artist}`);
        lastTrackId = currentTrackId;

        if (song.artist && song.title) {
          await findAndIncrementTrack(song.artist, song.title);
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

if (typeof window === 'undefined') {
    // This is a simple implementation of a polling mechanism on the server.
    // In a real production app, you would use a more robust scheduling system 
    // like Cloud Scheduler to trigger this flow, not setInterval.
    setInterval(() => {
        radiolizePollingFlow();
    }, 30000); // Poll every 30 seconds
}
