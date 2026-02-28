'use server';
/**
 * @fileOverview This file implements a Genkit flow that parses natural language commands to create tasks or reminders.
 *
 * - aiCreateTaskFromNaturalLanguage - A function that processes natural language input to extract task or reminder details.
 * - CreateTaskFromNaturalLanguageInput - The input type for the aiCreateTaskFromNaturalLanguage function.
 * - CreateTaskFromNaturalLanguageOutput - The return type for the aiCreateTaskFromNaturalLanguage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateTaskFromNaturalLanguageInputSchema = z.object({
  naturalLanguageCommand: z.string().describe('The natural language command from the user to create a task or reminder.'),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format for relative date extraction.'),
});
export type CreateTaskFromNaturalLanguageInput = z.infer<typeof CreateTaskFromNaturalLanguageInputSchema>;

const CreateTaskFromNaturalLanguageOutputSchema = z.object({
  title: z.string().describe('The title or main subject of the task or reminder.'),
  description: z.string().optional().describe('A more detailed description of the task or reminder, if provided.'),
  dueDate: z.string().nullable().describe('The due date of the task or reminder in ISO 8601 format (YYYY-MM-DD), or null if not specified. Infer date from relative terms like "tomorrow" or "next week".'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium').describe('The priority of the task or reminder. Defaults to "medium" if not specified.'),
  type: z.enum(['task', 'reminder']).describe('Specifies if the created item is a "task" or a "reminder".'),
});
export type CreateTaskFromNaturalLanguageOutput = z.infer<typeof CreateTaskFromNaturalLanguageOutputSchema>;

const prompt = ai.definePrompt({
  name: 'createTaskFromNaturalLanguagePrompt',
  input: { schema: CreateTaskFromNaturalLanguageInputSchema },
  output: { schema: CreateTaskFromNaturalLanguageOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are an AI assistant specialized in extracting task and reminder details from natural language commands.
Your goal is to parse the user's input and extract structured information about a task or reminder.

If the user clearly intends to create a task or reminder, provide the following details in JSON format:
- "title": A concise title for the task or reminder.
- "description": A more detailed explanation of the task or reminder, if the user provides enough information. If not, omit this field.
- "dueDate": The exact date the task or reminder is due. Use ISO 8601 format (YYYY-MM-DD). If the user uses relative terms like "tomorrow", "next week", "in 3 days", infer the correct date from the current date provided below. If no date is mentioned, set this to null.
- "priority": The urgency level. Choose from "low", "medium", "high", or "urgent". Default to "medium" if not specified by the user.
- "type": Determine if the user wants a "task" or a "reminder".

Do not include any conversational text or explanations outside of the JSON object.
Today's date is: {{{currentDate}}}

User command: {{{naturalLanguageCommand}}}`
});

const aiCreateTaskFromNaturalLanguageFlow = ai.defineFlow(
  {
    name: 'aiCreateTaskFromNaturalLanguageFlow',
    inputSchema: CreateTaskFromNaturalLanguageInputSchema,
    outputSchema: CreateTaskFromNaturalLanguageOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error) {
      console.error("Task Extraction Error:", error);
      throw error;
    }
  }
);

export async function aiCreateTaskFromNaturalLanguage(
  input: CreateTaskFromNaturalLanguageInput
): Promise<CreateTaskFromNaturalLanguageOutput> {
  return aiCreateTaskFromNaturalLanguageFlow(input);
}
