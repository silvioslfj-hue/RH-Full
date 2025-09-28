
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
    Você é um especialista em recrutamento de RH. Sua tarefa é gerar materiais abrangentes para a abertura de uma vaga para o cargo de "{{role}}".
    Forneça uma descrição detalhada e envolvente da vaga, um conjunto de perguntas de entrevista relevantes (tanto técnicas quanto comportamentais) e uma lista de habilidades-chave.

    Título da Vaga: {{role}}

    Instruções:
    1.  **Descrição da Vaga:** Escreva uma descrição de vaga atraente. Deve incluir:
        - Uma breve introdução ao cargo e à empresa.
        - Uma lista clara de responsabilidades principais.
        - Uma lista de qualificações e habilidades necessárias (tanto técnicas quanto comportamentais).
        - Uma menção aos benefícios ou à cultura da empresa.
        - Use Markdown para formatação (ex: cabeçalhos como '## Título', listas com '- Item').

    2.  **Perguntas de Entrevista:** Crie uma lista de perguntas de entrevista perspicazes.
        - Inclua uma mistura de perguntas técnicas para avaliar a capacidade e perguntas comportamentais para avaliar o ajuste cultural.
        - Categorize cada pergunta (ex: "Técnica", "Comportamental", "Situacional").

    3.  **Habilidades Necessárias:** Liste as habilidades e competências mais críticas para um candidato ter sucesso neste cargo.

    Gere a saída estritamente de acordo com o schema de saída fornecido.
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
