
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
import { timeBankData } from '@/lib/data';

const PayrollInputSchema = z.object({
  employeeName: z.string().describe('The name of the employee.'),
  grossSalary: z.number().describe('The base gross salary of the employee for the month.'),
  normalOvertimeHours: z.number().optional().describe('Total overtime hours worked on regular days.'),
  holidayOvertimeHours: z.number().optional().describe('Total overtime hours worked on Sundays and holidays.'),
  overtimeAction: z.enum(['pay', 'bank']).describe('What to do with the overtime hours: pay them or add to time bank.'),
  benefits: z.object({
    valeTransporte: z.number().optional().describe('Value of transportation benefit to be deducted.'),
    valeRefeicao: z.number().optional().describe('Value of meal benefit to be deducted.'),
  }).describe('Benefits provided to the employee.')
});
export type PayrollInput = z.infer<typeof PayrollInputSchema>;

const PayrollOutputSchema = z.object({
  grossSalary: z.number().describe('The base gross salary for the month.'),
  earnings: z.array(z.object({
    name: z.string().describe('Name of the earning (e.g., "Horas Extras (50%)", "Horas Banco Pagas").'),
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

// This tool simulates checking a database for expiring time bank hours
const getTimeBankStatus = ai.defineTool(
  {
    name: 'getTimeBankStatus',
    description: 'Verifica o status do banco de horas de um funcionário para ver se há horas próximas do vencimento.',
    inputSchema: z.object({ employeeName: z.string() }),
    outputSchema: z.object({
        hasExpiringHours: z.boolean(),
        expiringHours: z.number(),
    }),
  },
  async ({ employeeName }) => {
    // In a real app, this would query a database.
    const employeeEntry = timeBankData.find(e => e.employeeName === employeeName && (e.status === 'Crítico' || e.status === 'Atenção'));
    if (employeeEntry) {
        const hours = parseFloat(employeeEntry.expiringHours.replace('h', '.').replace('m', ''));
        return {
            hasExpiringHours: true,
            expiringHours: hours,
        }
    }
    return { hasExpiringHours: false, expiringHours: 0 };
  }
);


const prompt = ai.definePrompt({
  name: 'payrollPrompt',
  tools: [getTimeBankStatus],
  input: {schema: PayrollInputSchema},
  output: {schema: PayrollOutputSchema},
  prompt: `
    Você é um gerente de folha de pagamento inteligente e autônomo. Sua principal tarefa é calcular o holerite de um funcionário, mas com uma regra de negócio CRÍTICA: garantir que as horas do banco de horas prestes a expirar sejam pagas.

    **Seu processo deve ser o seguinte:**
    1.  **SEMPRE** comece usando a ferramenta \`getTimeBankStatus\` para verificar se o funcionário tem horas do banco de horas próximas do vencimento.
    2.  **Cenário 1: HÁ horas a expirar.**
        - Se a ferramenta retornar \`hasExpiringHours: true\`, você DEVE pagar essas horas.
        - Calcule o valor dessas horas (com acréscimo de 50%) e adicione-as aos proventos com o nome "Horas Banco Pagas".
        - O pagamento dessas horas do banco é PRIORITÁRIO. Todas as horas extras do mês (normais e de feriado) devem ser direcionadas para o banco de horas (ignorando o parâmetro \`overtimeAction\`).
    3.  **Cenário 2: NÃO HÁ horas a expirar.**
        - Se a ferramenta retornar \`hasExpiringHours: false\`, prossiga com o cálculo padrão das horas extras do mês, respeitando o parâmetro \`overtimeAction\` ('pay' ou 'bank').
        
    **Informações do Funcionário:**
    - Nome: {{{employeeName}}}
    - Salário Bruto: R$ {{{grossSalary}}}
    - Horas Extras Normais: {{{normalOvertimeHours}}}
    - Horas Extras (Domingos/Feriados): {{{holidayOvertimeHours}}}
    - Ação para Horas Extras (se não houver horas de banco a pagar): {{{overtimeAction}}}
    - Benefícios (descontos): Vale Transporte (R$ {{{benefits.valeTransporte}}}), Vale Refeição (R$ {{{benefits.valeRefeicao}}})

    **Regras Gerais de Cálculo:**
    - A base para cálculo da hora é o salário bruto para uma jornada de 220 horas mensais.
    - Horas extras normais ou horas do banco pagas têm um acréscimo de 50%.
    - Horas extras em domingos e feriados têm um acréscimo de 100%. Crie um item de provento separado "Horas Extras (100%)" para elas.
    - **Salário de Contribuição:** (salário bruto + valor de todas as horas extras pagas + valor das horas do banco pagas).
    - **Descontos (deductions):**
        a.  **INSS:** Calcule com base no salário de contribuição (tabela progressiva).
        b.  **IRRF:** Calcule com base em (Salário de Contribuição - INSS).
        c.  **Benefícios:** Inclua os valores informados.
        d.  **FGTS:** Calcule (8% sobre o salário de contribuição), mas liste-o como informativo, pois não é deduzido do líquido.
    - **Totais:** Calcule \`totalEarnings\`, \`totalDeductions\` (sem FGTS) e \`netSalary\`.

    Formate a saída estritamente como o JSON definido no schema de saída.
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
