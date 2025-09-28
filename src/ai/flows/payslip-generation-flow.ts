
'use server';

/**
 * @fileOverview An AI agent to generate the content of a payslip.
 * 
 * - generatePayslipContent - Generates the text content for an employee's payslip.
 * - PayslipGenerationInput - The input type for the function.
 * - PayslipGenerationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PayslipGenerationInputSchema = z.object({
  company: z.object({
    name: z.string().describe("Nome da empresa empregadora."),
    cnpj: z.string().describe("CNPJ da empresa empregadora."),
  }),
  employee: z.object({
    name: z.string().describe("Nome do funcionário."),
    role: z.string().describe("Cargo do funcionário."),
  }),
  competence: z.string().describe("Mês/Ano de referência da folha (ex: Julho/2024)."),
  payrollData: z.object({
    grossSalary: z.number(),
    earnings: z.array(z.object({ name: z.string(), value: z.number() })),
    deductions: z.array(z.object({ name: z.string(), value: z.number() })),
    totalEarnings: z.number(),
    totalDeductions: z.number(),
    netSalary: z.number(),
  }),
});
export type PayslipGenerationInput = z.infer<typeof PayslipGenerationInputSchema>;

const PayslipGenerationOutputSchema = z.object({
  payslipContent: z.string().describe('O conteúdo textual completo do holerite, formatado para exibição e com quebras de linha (\\n).'),
});
export type PayslipGenerationOutput = z.infer<typeof PayslipGenerationOutputSchema>;


export async function generatePayslipContent(input: PayslipGenerationInput): Promise<PayslipGenerationOutput> {
  return generatePayslipContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'payslipGenerationPrompt',
  input: { schema: z.any() },
  output: { schema: PayslipGenerationOutputSchema },
  prompt: `
    Você é um especialista do departamento de pessoal e sua tarefa é gerar o conteúdo de um holerite (recibo de pagamento) de forma clara e profissional, usando um layout de texto simples.

    Use os dados fornecidos abaixo para montar o holerite. A saída deve ser uma única string, com quebras de linha para formatação.

    **Dados para o Holerite:**
    - **Empresa:** {{company.name}} (CNPJ: {{company.cnpj}})
    - **Funcionário:** {{employee.name}} (Cargo: {{employee.role}})
    - **Competência:** {{competence}}

    **Valores da Folha:**
    - Salário Bruto: R$ {{payrollData.grossSalary}}
    - Total de Proventos: R$ {{payrollData.totalEarnings}}
    - Total de Descontos: R$ {{payrollData.totalDeductions}}
    - Salário Líquido: R$ {{payrollData.netSalary}}
    - Proventos Detalhados: {{{json payrollData.earnings}}}
    - Descontos Detalhados: {{{json payrollData.deductions}}}

    **Layout do Holerite (siga este formato):**

    ----------------------------------------------------------------
    EMPRESA: {{company.name}}
    CNPJ: {{company.cnpj}}
    ----------------------------------------------------------------
    RECIBO DE PAGAMENTO DE SALÁRIO
    Competência: {{competence}}
    ----------------------------------------------------------------
    Funcionário: {{employee.name}}
    Cargo: {{employee.role}}
    ----------------------------------------------------------------
    | Cód. | Descrição               |      Proventos |     Descontos |
    ----------------------------------------------------------------
    | 101  | SALÁRIO BASE              | R$ {{printf "%.2f" payrollData.grossSalary}}      |               |
    {{#each payrollData.earnings}}
    | 201  | {{padRight name 23}} | R$ {{printf "%.2f" value}}      |               |
    {{/each}}
    {{#each payrollData.deductions}}
    | 301  | {{padRight name 23}} |                | R$ {{printf "%.2f" value}}     |
    {{/each}}
    ----------------------------------------------------------------
    |      | TOTAIS                    | R$ {{printf "%.2f" payrollData.totalEarnings}}      | R$ {{printf "%.2f" payrollData.totalDeductions}}     |
    ----------------------------------------------------------------
    | SALÁRIO LÍQUIDO                                | R$ {{printf "%.2f" payrollData.netSalary}}     |
    ----------------------------------------------------------------
  `,
  custom: {
    // Helper to right-pad strings for alignment
    padRight: (str: string, len: number) => str.padEnd(len, ' '),
  },
});

const generatePayslipContentFlow = ai.defineFlow(
  {
    name: 'generatePayslipContentFlow',
    inputSchema: PayslipGenerationInputSchema,
    outputSchema: PayslipGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
