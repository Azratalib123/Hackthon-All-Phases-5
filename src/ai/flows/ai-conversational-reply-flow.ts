
'use server';
/**
 * @fileOverview Refined AI agent flow for TaskFlow AI.
 * Handles greetings, questions, and task creation in one stable pass.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiConversationalReplyInputSchema = z.object({
  message: z.string(),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })).optional(),
  currentDate: z.string().optional(),
});
export type AiConversationalReplyInput = z.infer<typeof AiConversationalReplyInputSchema>;

const AiConversationalReplyOutputSchema = z.object({
  reply: z.string(),
  taskData: z.object({
    title: z.string(),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
  }).nullable().optional(),
  error: z.string().optional(),
});
export type AiConversationalReplyOutput = z.infer<typeof AiConversationalReplyOutputSchema>;

const prompt = ai.definePrompt({
  name: 'conversationalReplyPrompt',
  input: { schema: AiConversationalReplyInputSchema },
  output: { schema: AiConversationalReplyOutputSchema },
  prompt: `You are TaskFlow AI. 

Instructions:
1. GREETINGS: If the user says "hi", "hello", or similar, reply with "Hi! How can I help you today?".
2. QUESTIONS: Answer any general questions dynamically and helpfully.
3. TASKS: If the user asks to create or add a task, extract the title and priority into 'taskData'. Set 'reply' to "Task created successfully!".
4. No hardcoded error strings in the reply.

History:
{{#each history}}
{{role}}: {{content}}
{{/each}}

User: {{{message}}}
AI:`,
});

export async function aiConversationalReply(input: AiConversationalReplyInput): Promise<AiConversationalReplyOutput> {
  try {
    const { output } = await prompt(input);
    return output || { reply: "I'm sorry, I couldn't process that.", error: "No output generated" };
  } catch (error: any) {
    // Return a safe error object instead of throwing to prevent 500 errors
    return { 
      reply: "", 
      error: error.message || 'AI service temporarily unavailable' 
    };
  }
}
