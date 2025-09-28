'use server';

/**
 * @fileOverview A payroll generation AI agent.
 *
 * - generatePayroll - A function that generates a payroll summary for an employee.
 * - PayrollInput - The input type for the generatePayroll function.
 * - PayrollOutput - The return type for the generatePayroll function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PayrollInputSchema = z.object({
  employeeName: z.string().describe('The name of the employee.'),
  grossSalary: z.number().describe('The base gross salary of the employee for the month.'),
  hoursWorked: z.number().describe('Total hours worked in the month.'),
  overtimeHours: z.number().describe('Total overtime hours worked in the month.'),
  benefits: z.object({
    valeTransporte: z.number().optional().describe('Value of transportation benefit to be deducted.'),
    valeRefeicao: z.number().optional().describe('Value of meal benefit to be deducted.'),
  }).describe('Benefits provided to the employee.')
});
export type PayrollInput = z.infer<typeof PayrollInputSchema>;

const PayrollOutputSchema = z.object({
  grossSalary: z.number().describe('The base gross salary for the month.'),
  earnings: z.array(z.object({
    name: z.string().describe('Name of the earning (e.g., "Horas Extras").'),
    value: z.number().describe('Value of the earning.'),
  })).describe('List of all earnings (proventos).'),
  deductions: z.array(z.object({
    name: z.string().describe('Name of the deduction (e.g., "INSS", "IRRF").'),
    value: z.number().describe('Value of the deduction.'),
  })).describe('List of all deductions (descontos). Includes FGTS for informational purposes only.'),
  totalEarnings: z.number().describe('The total sum of all earnings.'),
  totalDeductions: z.number().describe('The total sum of all deductions.'),
  netSalary: z.number().describe('The final net salary to be paid (totalEarnings - totalDeductions).'),
});
export type PayrollOutput = z.infer<typeof PayrollOutputSchema>;


export async function generatePayroll(input: PayrollInput): Promise<PayrollOutput> {
  return generatePayrollFlow(input);
}

const prompt = ai.definePrompt({
  name: 'payrollPrompt',
  input: {schema: PayrollInputSchema},
  output: {schema: PayrollOutputSchema},
  prompt: `
    Você é um especialista em folha de pagamento no Brasil. Sua tarefa é calcular o holerite de um funcionário com base nas informações fornecidas, seguindo a legislação trabalhista brasileira.

    Informações do Funcionário:
    - Nome: {{{employeeName}}}
    - Salário Bruto: R$ {{{grossSalary}}}
    - Horas Trabalhadas: {{{hoursWorked}}}
    - Horas Extras: {{{overtimeHours}}}
    - Benefícios (descontos): Vale Transporte (R$ {{{benefits.valeTransporte}}}), Vale Refeição (R$ {{{benefits.valeRefeicao}}})

    Regras de Cálculo:
    1.  **Horas Extras:** Calcule o valor das horas extras. Considere que a hora extra vale 50% a mais que a hora normal. A base de cálculo é o salário bruto para uma jornada de 220 horas mensais.
    2.  **Proventos (earnings):** Liste o salário bruto e o valor das horas extras como proventos.
    3.  **Descontos (deductions):**
        a.  **INSS:** Calcule o desconto do INSS com base no salário de contribuição (salário bruto + horas extras), aplicando as alíquotas progressivas da tabela vigente.
        b.  **IRRF:** Calcule o desconto do Imposto de Renda Retido na Fonte. A base de cálculo é (Salário de Contribuição - INSS). Aplique as alíquotas e deduções da tabela vigente.
        c.  **Benefícios:** Inclua os valores de vale transporte e vale refeição como descontos.
        d.  **FGTS:** Calcule o valor do FGTS (8% sobre o salário de contribuição). **Importante:** O FGTS não é descontado do salário do empregado, mas deve ser listado nos descontos com a observação "(informativo)".
    4.  **Totais e Líquido:**
        a.  Calcule \`totalEarnings\` (soma de todos os proventos).
        b.  Calcule \`totalDeductions\` (soma de todos os descontos, exceto FGTS).
        c.  Calcule \`netSalary\` (totalEarnings - totalDeductions).

    Formate a saída estritamente como o JSON definido no schema de saída. Preencha todos os campos.
  `,
});

const generatePayrollFlow = ai.defineFlow(
  {
    name: 'generatePayrollFlow',
    inputSchema: PayrollInputSchema,
    outputSchema: PayrollOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
