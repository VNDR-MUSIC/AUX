# **App Name**: VNDR Music

## Core Features:

- Music Streaming: Stream music with adaptive bitrate and offline playback.
- AI-Powered Recommendations: Suggest personalized music based on listening history using Vertex AI.
- Music Upload and Management: Upload music tracks with metadata and cover art; includes progress tracking.
- Licensing Platform: Allow users to create licensing requests.
- VSD Token Integration: Integrate VSD token for transactions using a secure bridge API `/src/app/api/vsd-bridge/route.ts` with `INTERNAL_API_KEY`. Provides the functionality for users to purchase music with VSD via the `/vsd-demo` page.
- Role-Based Dashboards: Provide different dashboards for artists, listeners, publishers, and admins.
- AI Cover Art Generation: Generative AI tool that suggests cover art with the use of AI based on the track's genre and title using Vertex AI's Imagen.

## Style Guidelines:

- Primary gradient: Animated gradient transitioning from purple (#8A2BE2) to pink (#FF69B4) to red (#FF0000) in a symmetrical stylized soundwave graphic with vertical bars and dots. Smooth animation: bars scale up and down like a soundwave
- Background color: White (#FFFFFF) to provide a clean backdrop that highlights the vibrant gradients.
- Accent gradient: Use the primary animated gradient for interactive elements, buttons, borders, and lines to maintain visual consistency.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text.
- Code font: 'Source Code Pro' for displaying code snippets related to smart contracts and token integration.
- Use minimalist and modern icons, filled with the animated primary gradient, for navigation and actions.
- Subtle transitions and animations on user interactions, incorporating the animated primary gradient, to enhance engagement.