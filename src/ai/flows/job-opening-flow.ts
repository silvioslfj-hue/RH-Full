
'use server';

/**
 * @fileOverview An AI agent for generating job opening materials.
 * 
 * - generateJobOpening - Generates a job description, interview questions, and skills.
 * - JobOpeningInput - The input type for the function.
 * - JobOpeningOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const JobOpeningInputSchema = z.object({
  role: z.string().describe('The job title for which to generate the materials (e.g., "Senior AI Developer").'),
});
export type JobOpeningInput = z.infer<typeof JobOpeningInputSchema>;

export const JobOpeningOutputSchema = z.object({
  description: z.string().describe('A complete and attractive job description, including responsibilities, qualifications, and benefits. Format using Markdown.'),
  interviewQuestions: z.array(z.object({
    category: z.string().describe('The category of the question (e.g., "Technical", "Behavioral").'),
    question: z.string().describe('The interview question.'),
  })).describe('A list of suggested interview questions.'),
  requiredSkills: z.array(z.string()).describe('A list of essential skills and competencies for the role.'),
});
export type JobOpeningOutput = z.infer<typeof JobOpeningOutputSchema>;

export async function generateJobOpening(input: JobOpeningInput): Promise<JobOpeningOutput> {
  return generateJobOpeningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobOpeningPrompt',
  input: { schema: JobOpeningInputSchema },
  output: { schema: JobOpeningOutputSchema },
  prompt: `
    You are an expert HR recruitment specialist. Your task is to generate comprehensive job opening materials for the role of "{{role}}".
    Provide a detailed and engaging job description, a set of relevant interview questions (both technical and behavioral), and a list of key skills.

    Job Title: {{role}}

    Instructions:
    1.  **Job Description:** Write a compelling job description. It should include:
        - A brief introduction to the role and the company.
        - A clear list of key responsibilities.
        - A list of required qualifications and skills (both hard and soft).
        - A mention of company benefits or culture.
        - Use Markdown for formatting (e.g., headers, bullet points).

    2.  **Interview Questions:** Create a list of insightful interview questions.
        - Include a mix of technical questions to assess capability and behavioral questions to gauge fit.
        - Categorize each question (e.g., "Technical", "Behavioral", "Situational").

    3.  **Required Skills:** List the most critical skills and competencies for a candidate to succeed in this role.

    Generate the output strictly according to the provided output schema.
  `,
});

const generateJobOpeningFlow = ai.defineFlow(
  {
    name: 'generateJobOpeningFlow',
    inputSchema: JobOpeningInputSchema,
    outputSchema: JobOpeningOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
