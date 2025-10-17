
'use server';

/**
 * @fileOverview A Genkit tool for fetching and caching the platform's knowledge base content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import fetch from 'node-fetch';

// Simple in-memory cache with a Time-To-Live (TTL)
const cache = {
  content: null as string | null,
  lastFetched: 0,
  ttl: 24 * 60 * 60 * 1000, // 24 hours
};

// Input schema for the tool (empty for now)
const KnowledgeBaseInputSchema = z.object({});

// Output schema for the tool
const KnowledgeBaseOutputSchema = z.string();

/**
 * Strips HTML tags from a string.
 * @param html The HTML string to clean.
 * @returns The cleaned text content.
 */
function stripHtml(html: string): string {
  // A simple regex to remove tags. In a real app, a library like 'cheerio' would be more robust.
  return html.replace(/<[^>]*>/g, ' ').replace(/\s\s+/g, ' ').trim();
}

export const getKnowledgeBase = ai.defineTool(
  {
    name: 'getKnowledgeBase',
    description: "Retrieves the text content of the platform's knowledge base to answer user questions about how the platform works. This is the primary source of truth for platform features, plans, and the token economy.",
    inputSchema: KnowledgeBaseInputSchema,
    outputSchema: KnowledgeBaseOutputSchema,
  },
  async () => {
    const now = Date.now();
    if (cache.content && now - cache.lastFetched < cache.ttl) {
      // Return cached content if it's not expired
      return cache.content;
    }

    try {
      // In a real app, the base URL would come from an environment variable.
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
      const response = await fetch(`${baseUrl}/symbi`);
      if (!response.ok) {
        throw new Error(`Failed to fetch knowledge base: ${response.statusText}`);
      }
      const htmlContent = await response.text();
      const textContent = stripHtml(htmlContent);

      // Update cache
      cache.content = textContent;
      cache.lastFetched = now;

      return textContent;
    } catch (error) {
      console.error("Error fetching or processing knowledge base:", error);
      // Return stale cache if available, otherwise return an error message.
      return cache.content || "Error: Unable to load knowledge base content at this time.";
    }
  }
);
