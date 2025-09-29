
'use server';

/**
 * @fileOverview An income report generation AI agent.
 * 
 * - generateIncomeReport - Generates the text content for an annual income report.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { IncomeReportInputSchema, IncomeReportOutputSchema, type IncomeReportInput, type IncomeReportOutput } from '@/lib/data';

export async function generateIncomeReport(input: IncomeReportInput): Promise<IncomeReportOutput> {
  return generateIncomeReportFlow(input);
}

// In a real app, this would fetch consolidated payroll data for the employee for the entire year.
const getMockAnnualData = (employeeId: string, year: number) => {
    // This is a simulation.
    return {
        employee: { name: 'Jane Doe', cpf: '123.456.789-00' },
        company: { name: 'RH Lite Soluções em TI', cnpj: '01.234.567/0001-89' },
        totalTaxableIncome: 90000.00, // Total rendimentos (salários, férias, etc.)
        thirteenthSalary: 7500.00, // Décimo terceiro
        incomeTaxWithheld: 15000.00, // Imposto de Renda Retido na Fonte
        inssContribution: 9900.00, // Contribuição Previdenciária Oficial
    };
};

const prompt = ai.definePrompt({
  name: 'incomeReportPrompt',
  input: { schema: z.any() },
  output: { schema: IncomeReportOutputSchema },
  prompt: `
    Você é um especialista do departamento de pessoal e sua tarefa é gerar o conteúdo de um **Informe de Rendimentos** para a declaração de Imposto de Renda, seguindo o padrão da Receita Federal.

    Use os dados consolidados do ano fornecidos abaixo para montar o informe. A saída deve ser uma única string, com quebras de linha para formatação e seções bem definidas.

    **Dados Consolidados para o Informe:**
    - **Ano-Calendário:** {{year}}
    - **Fonte Pagadora (Empresa):** {{company.name}} (CNPJ: {{company.cnpj}})
    - **Pessoa Física Beneficiária (Funcionário):** {{employee.name}} (CPF: {{employee.cpf}})

    **Valores Consolidados:**
    - Total de Rendimentos Tributáveis: R$ {{totalTaxableIncome}}
    - Contribuição Previdenciária Oficial: R$ {{inssContribution}}
    - Imposto sobre a Renda Retido na Fonte: R$ {{incomeTaxWithheld}}
    - 13º Salário: R$ {{thirteenthSalary}}

    **Layout do Informe (siga este formato rigorosamente):**

    ================================================================
    INFORME DE RENDIMENTOS - ANO-CALENDÁRIO DE {{year}}
    ================================================================

    1. FONTE PAGADORA
    ----------------------------------------------------------------
    NOME: {{company.name}}
    CNPJ: {{company.cnpj}}

    2. PESSOA FÍSICA BENEFICIÁRIA DOS RENDIMENTOS
    ----------------------------------------------------------------
    NOME: {{employee.name}}
    CPF: {{employee.cpf}}

    3. RENDIMENTOS TRIBUTÁVEIS, DEDUÇÕES E IMPOSTO RETIDO NA FONTE
    ----------------------------------------------------------------
    1. Total dos rendimentos (inclusive férias) ............: R$ {{totalTaxableIncome}}
    2. Contribuição previdenciária oficial ...................: R$ {{inssContribution}}
    3. Imposto sobre a renda retido na fonte .................: R$ {{incomeTaxWithheld}}
    
    5. RENDIMENTOS SUJEITOS À TRIBUTAÇÃO EXCLUSIVA (RENDIMENTO LÍQUIDO)
    ----------------------------------------------------------------
    1. Décimo terceiro salário ...............................: R$ {{thirteenthSalary}}

    ================================================================
    Este é um documento gerado por sistema para fins de declaração de Imposto de Renda.
  `,
});

const generateIncomeReportFlow = ai.defineFlow(
  {
    name: 'generateIncomeReportFlow',
    inputSchema: IncomeReportInputSchema,
    outputSchema: IncomeReportOutputSchema,
  },
  async (input) => {
    const annualData = getMockAnnualData(input.employeeId, input.year);

    const promptInput = {
      ...input,
      ...annualData,
      // Format numbers to string with 2 decimal places for the prompt
      totalTaxableIncome: annualData.totalTaxableIncome.toFixed(2),
      inssContribution: annualData.inssContribution.toFixed(2),
      incomeTaxWithheld: annualData.incomeTaxWithheld.toFixed(2),
      thirteenthSalary: annualData.thirteenthSalary.toFixed(2),
    };

    const { output } = await prompt(promptInput);
    return output!;
  }
);
