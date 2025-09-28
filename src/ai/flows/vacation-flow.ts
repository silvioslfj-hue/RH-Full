
'use server';

/**
 * @fileOverview An eSocial vacation/leave event data generation AI agent.
 * 
 * - generateVacationData - Generates structured data for an S-2230 eSocial event.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VacationInputSchema = z.object({
  employeeId: z.string().describe('The ID of the employee taking leave.'),
  startDate: z.string().describe('The start date of the leave (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date of the leave (YYYY-MM-DD).'),
  reasonCode: z.string().describe('The eSocial code for the reason of leave (e.g., "15" for vacation).'),
});
export type VacationInput = z.infer<typeof VacationInputSchema>;

const S2230DataSchema = z.object({
  evtAfastTemp: z.object({
    ideVinculo: z.object({
      cpfTrab: z.string().describe('CPF do Trabalhador.'),
      matricula: z.string().describe('Matrícula do trabalhador na empresa.'),
    }),
    infoAfastamento: z.object({
      iniAfastamento: z.object({
        dtIniAfast: z.string().describe('Data de início do afastamento no formato AAAA-MM-DD.'),
        codMotivoAfast: z.string().describe('Código do motivo de afastamento conforme tabela 18 do eSocial.'),
      }),
      fimAfastamento: z.object({
        dtTermAfast: z.string().describe('Data de término do afastamento no formato AAAA-MM-DD.'),
      }).optional(),
    }),
  }),
});

export type VacationData = z.infer<typeof S2230DataSchema>;

export async function generateVacationData(input: VacationInput): Promise<VacationData> {
  return generateVacationFlow(input);
}

// In a real app, this would fetch data from a database
const getEmployeeForVacation = (employeeId: string) => {
    const mockDatabase: Record<string, any> = {
        'FUNC001': { cpf: '111.222.333-44', matricula: 'M-1001' },
        'FUNC002': { cpf: '555.666.777-88', matricula: 'M-1002' },
        'FUNC003': { cpf: '999.888.777-66', matricula: 'M-1003' },
    };
    return mockDatabase[employeeId] || null;
}

const prompt = ai.definePrompt({
  name: 'esocialS2230Prompt',
  input: { schema: z.any() }, 
  output: { schema: S2230DataSchema },
  prompt: `
    Você é um especialista em eSocial. Sua tarefa é gerar os dados para o evento S-2230 (Afastamento Temporário) com base nas informações fornecidas.
    Gere o evento de início e, se a data de término for informada, o evento de fim do afastamento.

    Use os seguintes dados como fonte:
    \`\`\`json
    {{{json input}}}
    \`\`\`

    Observações importantes:
    - O campo 'cpfTrab' e 'matricula' são obrigatórios.
    - O campo 'dtIniAfast' é obrigatório.
    - O campo 'codMotivoAfast' é obrigatório.
    - Se 'dtTermAfast' for fornecido, inclua o bloco 'fimAfastamento'.

    Gere o objeto JSON correspondente ao schema de saída.
  `,
});

const generateVacationFlow = ai.defineFlow(
  {
    name: 'generateVacationFlow',
    inputSchema: VacationInputSchema,
    outputSchema: S2230DataSchema,
  },
  async (input) => {
    const employeeData = getEmployeeForVacation(input.employeeId);

    if (!employeeData) {
        throw new Error(`Employee with ID ${input.employeeId} not found.`);
    }

    const promptData = {
      employee: {
        cpf: employeeData.cpf.replace(/\D/g, ''),
        matricula: employeeData.matricula,
      },
      dtIniAfast: input.startDate,
      dtTermAfast: input.endDate,
      codMotivoAfast: input.reasonCode,
    };

    const { output } = await prompt(promptData);
    
    return output!;
  }
);
