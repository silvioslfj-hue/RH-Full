
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
    {{{payrollData}}}

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
    {{{payrollData.tableBody}}}
    ----------------------------------------------------------------
    |      | TOTAIS                    | R$ {{payrollData.totalEarnings}} | R$ {{payrollData.totalDeductions}} |
    ----------------------------------------------------------------
    | SALÁRIO LÍQUIDO                                | R$ {{payrollData.netSalary}} |
    ----------------------------------------------------------------
  `,
});

const generatePayslipContentFlow = ai.defineFlow(
  {
    name: 'generatePayslipContentFlow',
    inputSchema: PayslipGenerationInputSchema,
    outputSchema: PayslipGenerationOutputSchema,
  },
  async (input) => {
    // Helper to pad strings for alignment
    const pad = (str: string, len: number) => String(str).padEnd(len, ' ');

    let tableBody = `| 101  | ${pad('SALÁRIO BASE', 23)} | R$ ${pad(input.payrollData.grossSalary.toFixed(2), 12)} |               |\n`;
    
    input.payrollData.earnings.forEach(e => {
        tableBody += `    | 201  | ${pad(e.name, 23)} | R$ ${pad(e.value.toFixed(2), 12)} |               |\n`;
    });

    input.payrollData.deductions.forEach(d => {
        tableBody += `    | 301  | ${pad(d.name, 23)} |                | R$ ${pad(d.value.toFixed(2), 11)} |\n`;
    });

    const promptInput = {
      ...input,
      payrollData: {
        tableBody: tableBody.trim(),
        totalEarnings: pad(input.payrollData.totalEarnings.toFixed(2), 12),
        totalDeductions: pad(input.payrollData.totalDeductions.toFixed(2), 11),
        netSalary: pad(input.payrollData.netSalary.toFixed(2), 11),
      },
    };
    
    const { output } = await prompt(promptInput);
    return output!;
  }
);
