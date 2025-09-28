
'use server';

/**
 * @fileOverview An AI agent to generate the content of a payslip.
 * 
 * - generatePayslipContent - Generates the text content for an employee's payslip.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PayslipGenerationInput, PayslipGenerationInputSchema, PayslipGenerationOutput, PayslipGenerationOutputSchema } from '@/lib/data';


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
    | 101  | SALÁRIO BASE              | R$ {{padRight payrollData.grossSalary 12}} |               |
    {{#each payrollData.earnings}}
    | 201  | {{padRight name 23}} | R$ {{padRight value 12}} |               |
    {{/each}}
    {{#each payrollData.deductions}}
    | 301  | {{padRight name 23}} |                | R$ {{padRight value 11}} |
    {{/each}}
    ----------------------------------------------------------------
    |      | TOTAIS                    | R$ {{padRight payrollData.totalEarnings 12}} | R$ {{padRight payrollData.totalDeductions 11}} |
    ----------------------------------------------------------------
    | SALÁRIO LÍQUIDO                                | R$ {{padRight payrollData.netSalary 11}} |
    ----------------------------------------------------------------
  `,
  custom: {
    // Helper to right-pad strings for alignment
    padRight: (str: string, len: number) => String(str).padEnd(len, ' '),
  },
});

const generatePayslipContentFlow = ai.defineFlow(
  {
    name: 'generatePayslipContentFlow',
    inputSchema: PayslipGenerationInputSchema,
    outputSchema: PayslipGenerationOutputSchema,
  },
  async (input) => {
    // Format all numbers to two decimal places as strings for the prompt
    const formattedPayrollData = {
      grossSalary: input.payrollData.grossSalary.toFixed(2),
      totalEarnings: input.payrollData.totalEarnings.toFixed(2),
      totalDeductions: input.payrollData.totalDeductions.toFixed(2),
      netSalary: input.payrollData.netSalary.toFixed(2),
      earnings: input.payrollData.earnings.map(e => ({ ...e, value: e.value.toFixed(2) })),
      deductions: input.payrollData.deductions.map(d => ({ ...d, value: d.value.toFixed(2) })),
    };

    const promptInput = {
      ...input,
      payrollData: formattedPayrollData,
    };
    
    const { output } = await prompt(promptInput);
    return output!;
  }
);
