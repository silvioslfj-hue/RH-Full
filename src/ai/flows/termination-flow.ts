
'use server';

/**
 * @fileOverview An AI agent for handling employee termination processes.
 * 
 * - generateTerminationData - Generates structured data for an S-2299 eSocial event and calculates termination pay.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TerminationInputSchema = z.object({
  employeeId: z.string().describe('The ID of the employee being terminated.'),
  terminationDate: z.string().describe('The official date of termination (YYYY-MM-DD).'),
  reasonCode: z.string().describe('The eSocial code for the reason of termination (e.g., "01" for dismissal without just cause).'),
});
export type TerminationInput = z.infer<typeof TerminationInputSchema>;

const TerminationOutputSchema = z.object({
  s2299_data: z.object({
    evtDeslig: z.object({
      ideVinculo: z.object({
        cpfTrab: z.string().describe('CPF do Trabalhador.'),
        matricula: z.string().describe('Matrícula do trabalhador na empresa.'),
      }),
      infoDeslig: z.object({
        mtvDeslig: z.string().describe('Código do motivo do desligamento conforme tabela 19 do eSocial.'),
        dtDeslig: z.string().describe('Data do desligamento no formato AAAA-MM-DD.'),
        verbasResc: z.object({
            dmDev: z.array(z.object({
                ideDmDev: z.string().describe('Identificador único do demonstrativo de pagamento.'),
                codCateg: z.string().describe('Código da categoria do trabalhador.'),
                infoPerApur: z.object({
                    perApur: z.string().describe('Período de apuração (AAAA-MM).'),
                    itensRemun: z.array(z.object({
                        codRubr: z.string().describe('Código da rubrica (e.g., 1000 para Saldo de Salários).'),
                        ideTabRubr: z.string().describe('Identificador da tabela de rubricas.'),
                        vrRubr: z.number().describe('Valor da rubrica.'),
                    }))
                })
            }))
        })
      }),
    }),
  }),
  terminationPaySummary: z.object({
    severancePay: z.number().describe('Total das verbas rescisórias.'),
    salaryBalance: z.number().describe('Saldo de salário.'),
    vacationPay: z.number().describe('Férias (vencidas e proporcionais).'),
    thirteenthSalaryPay: z.number().describe('13º salário proporcional.'),
  }),
});
export type TerminationOutput = z.infer<typeof TerminationOutputSchema>;


export async function generateTerminationData(input: TerminationInput): Promise<TerminationOutput> {
  return generateTerminationFlow(input);
}


// In a real app, this would fetch data from a database
const getEmployeeForTermination = (employeeId: string) => {
    const mockDatabase: Record<string, any> = {
        'FUNC001': { cpf: '111.222.333-44', matricula: 'M-1001', admissionDate: '2022-01-10', salary: 5000.00, hasUnpaidVacation: true },
        'FUNC004': { cpf: '999.888.777-66', matricula: 'M-1004', admissionDate: '2023-05-20', salary: 4000.00, hasUnpaidVacation: false },
    };
    return mockDatabase[employeeId] || null;
}


const prompt = ai.definePrompt({
  name: 'esocialS2299Prompt',
  input: { schema: z.any() }, 
  output: { schema: TerminationOutputSchema },
  prompt: `
    Você é um especialista em eSocial e legislação trabalhista. Sua tarefa é gerar os dados para o evento S-2299 (Desligamento) e um resumo das verbas rescisórias com base nas informações fornecidas.

    Use os seguintes dados como fonte:
    \`\`\`json
    {{{json input}}}
    \`\`\`

    **Regras de Cálculo de Verbas Rescisórias:**
    - **Se 'mtvDeslig' for "01" (Rescisão COM Justa Causa):**
      - O funcionário tem direito APENAS a:
        1. **Saldo de Salários** (codRubr: 1000): Calcule proporcional aos dias trabalhados no mês do desligamento.
        2. **Férias Vencidas + 1/3** (codRubr: 7000): Calcule APENAS se 'hasUnpaidVacation' for true. O valor é 1.33 * salário.
      - NÃO calcular: Aviso prévio, 13º salário proporcional, férias proporcionais. Os valores para estes devem ser ZERO.

    - **Se 'mtvDeslig' for diferente de "01" (ex: Rescisão SEM Justa Causa):**
      - Calcule TODAS as verbas a seguir:
      1. **Saldo de Salários** (codRubr: 1000): Proporcional aos dias trabalhados no mês do desligamento.
      2. **Aviso Prévio Indenizado** (codRubr: 6000): Use o valor de 1 salário.
      3. **13º Salário Proporcional** (codRubr: 5501): Calcule (salário / 12 * meses trabalhados no ano).
      4. **Férias Vencidas + 1/3** (codRubr: 7000): Se 'hasUnpaidVacation' for true, use 1.33 * salário.
      5. **Férias Proporcionais + 1/3** (codRubr: 7001): Calcule (salário / 12 * meses desde a última férias) * 1.33.

    **Instruções para a Saída:**
    1.  **s2299_data:** Preencha a estrutura do evento S-2299. Inclua em 'itensRemun' apenas as rubricas com valor maior que zero.
    2.  **terminationPaySummary:** Preencha o resumo com os valores calculados para cada campo. Se uma verba não for devida (ex: 13º em justa causa), seu valor deve ser 0. O campo 'severancePay' deve ser a soma de TODAS as verbas calculadas.

    Gere o objeto JSON completo correspondente ao schema de saída.
  `,
});

const generateTerminationFlow = ai.defineFlow(
  {
    name: 'generateTerminationFlow',
    inputSchema: TerminationInputSchema,
    outputSchema: TerminationOutputSchema,
  },
  async (input) => {
    const employeeData = getEmployeeForTermination(input.employeeId);

    if (!employeeData) {
        throw new Error(`Employee with ID ${input.employeeId} not found.`);
    }

    const promptData = {
        employee: {
            cpf: employeeData.cpf.replace(/\D/g, ''),
            matricula: employeeData.matricula,
            admissionDate: employeeData.admissionDate,
            salary: employeeData.salary,
            hasUnpaidVacation: employeeData.hasUnpaidVacation,
        },
        mtvDeslig: input.reasonCode,
        dtDeslig: input.terminationDate,
    };

    const { output } = await prompt(promptData);
    
    return output!;
  }
);
