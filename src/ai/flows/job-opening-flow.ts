
'use server';

/**
 * @fileOverview An AI agent for generating job opening materials.
 * 
 * - generateJobOpening - Generates a job description, interview questions, and skills.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { JobOpeningInputSchema, JobOpeningOutputSchema, type JobOpeningInput, type JobOpeningOutput } from '@/lib/data';


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
