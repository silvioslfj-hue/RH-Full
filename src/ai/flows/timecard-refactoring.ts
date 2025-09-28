'use server';

/**
 * @fileOverview Timecard data refactoring AI agent.
 *
 * - reformatTimecard - A function that reformats timecard data.
 * - TimecardRefactoringInput - The input type for the reformatTimecard function.
 * - TimecardRefactoringOutput - The return type for the reformatTimecard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimecardRefactoringInputSchema = z.object({
  timecardData: z
    .string()
    .describe('The timecard data to be reformatted, if necessary.'),
});
export type TimecardRefactoringInput = z.infer<typeof TimecardRefactoringInputSchema>;

const TimecardRefactoringOutputSchema = z.object({
  reformattedTimecardData: z
    .string()
    .describe('The reformatted timecard data, or the original data if no reformatting was needed.'),
  reformattingRequired: z
    .boolean()
    .describe('Whether or not the timecard data needed to be reformatted.'),
});
export type TimecardRefactoringOutput = z.infer<typeof TimecardRefactoringOutputSchema>;

export async function reformatTimecard(input: TimecardRefactoringInput): Promise<TimecardRefactoringOutput> {
  return reformatTimecardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'timecardRefactoringPrompt',
  input: {schema: TimecardRefactoringInputSchema},
  output: {schema: TimecardRefactoringOutputSchema},
  prompt: `You are an expert in timecard data and payroll processing.

You will be given timecard data in various formats. Your goal is to reformat the data into a consistent, easily processable format for payroll systems.

If the timecard data is already in a valid, processable format, you should return the original data and set reformattingRequired to false.

If the timecard data is in an invalid or inconsistent format, you should reformat it and set reformattingRequired to true. The output should be valid JSON.

Timecard Data: {{{timecardData}}}
`,
});

const reformatTimecardFlow = ai.defineFlow(
  {
    name: 'reformatTimecardFlow',
    inputSchema: TimecardRefactoringInputSchema,
    outputSchema: TimecardRefactoringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
