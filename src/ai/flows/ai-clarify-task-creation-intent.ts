'use server';
/**
 * @fileOverview This file implements a Genkit flow for clarifying user intent regarding task creation.
 * Updated with detailed error handling for debugging.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClarifyTaskCreationIntentInputSchema = z.object({
  userMessage: z.string().describe('The user\'s message to analyze for task creation intent.').min(1, 'User message cannot be empty.'),
});
export type ClarifyTaskCreationIntentInput = z.infer<typeof ClarifyTaskCreationIntentInputSchema>;

const ClarifyTaskCreationIntentOutputSchema = z.object({
  isTaskCreationIntentClear: z.boolean().describe('True if the user\'s intent to create a task is clear and explicit.').default(false),
  requiresClarification: z.boolean().describe('True if the user\'s message is ambiguous and needs clarification regarding task creation.').default(false),
  identifiedIntent: z.string().describe('A brief summary of the identified intent.'),
  error: z.string().optional().describe('Error message if the flow fails.'),
});
export type ClarifyTaskCreationIntentOutput = z.infer<typeof ClarifyTaskCreationIntentOutputSchema>;

const clarifyTaskCreationIntentPrompt = ai.definePrompt({
  name: 'clarifyTaskCreationIntentPrompt',
  input: { schema: ClarifyTaskCreationIntentInputSchema },
  output: { schema: ClarifyTaskCreationIntentOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `Analyze the user's message to see if they want to CREATE or ADD a new task/reminder.

Logic:
- TASK INTENT: Only set 'isTaskCreationIntentClear' to true if the user is explicitly asking to create, add, or be reminded of something NEW. Example: "add task...", "create reminder...", "remind me to...".
- GREETING/CHAT: If the user says "hi", "hello", "how are you", or asks a general question, set 'isTaskCreationIntentClear' to false.

User Message: {{{userMessage}}}`,
});

const clarifyTaskCreationIntentFlow = ai.defineFlow(
  {
    name: 'clarifyTaskCreationIntentFlow',
    inputSchema: ClarifyTaskCreationIntentInputSchema,
    outputSchema: ClarifyTaskCreationIntentOutputSchema,
  },
  async (input) => {
    // Check for API Key
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL ERROR: API Key missing in clarifyTaskCreationIntentFlow');
      return {
        isTaskCreationIntentClear: false,
        requiresClarification: false,
        identifiedIntent: "error",
        error: "Missing API Key"
      };
    }

    try {
      const { output } = await clarifyTaskCreationIntentPrompt(input);
      return output!;
    } catch (error: any) {
      console.error('Clarify Intent Flow Error:', error);
      return {
        isTaskCreationIntentClear: false,
        requiresClarification: false,
        identifiedIntent: "error",
        error: error.message
      };
    }
  }
);

export async function clarifyTaskCreationIntent(input: ClarifyTaskCreationIntentInput): Promise<ClarifyTaskCreationIntentOutput> {
  return clarifyTaskCreationIntentFlow(input);
}
