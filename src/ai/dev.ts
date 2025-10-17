
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-powered-recommendations.ts';
import '@/ai/flows/ai-cover-art-generation.ts';
import '@/ai/flows/ai-licensing-price-recommendation.ts';
import '@/ai/flows/symbi-chat-flow.ts';
import '@/ai/flows/legal-eagle-flow.ts';
import '@/ai/flows/generate-report-flow.ts';
import '@/ai/flows/radiolize-polling-flow.ts';
import '@/ai/tools/get-knowledge-base-tool.ts';
import '@/ai/tools/register-work-with-pro-tool.ts';
import '@/ai/tools/update-license-request-status-tool.ts';
