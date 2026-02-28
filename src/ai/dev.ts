import { config } from 'dotenv';
config();

import '@/ai/flows/ai-conversational-reply-flow.ts';
import '@/ai/flows/ai-clarify-task-creation-intent.ts';
import '@/ai/flows/ai-create-task-from-natural-language.ts';