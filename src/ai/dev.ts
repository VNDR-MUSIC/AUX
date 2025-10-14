import { config } from 'dotenv';
config();

import '@/ai/flows/ai-powered-recommendations.ts';
import '@/ai/flows/ai-cover-art-generation.ts';
import '@/ai/flows/ai-licensing-price-recommendation.ts';
import '@/ai/flows/muso-partnership-flow.ts';
import '@/ai/flows/symbi-chat-flow.ts';
import '@/ai/flows/legal-eagle-flow.ts';

// Type definition files are for type safety and are not flows to be registered.
// They don't need to be imported here.
