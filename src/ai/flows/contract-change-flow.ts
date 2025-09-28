
'use server';

/**
 * @fileOverview An eSocial contract change event data generation AI agent.
 * 
 * - generateContractChangeData - Generates structured data for an S-2206 eSocial event.
 * - ContractChangeInput - The input type for the function.
 * - ContractChangeData - The return type for the function (structured data).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ContractChangeInputSchema = z.object({
  employeeId: z.string().describe('The ID of the employee whose contract is being changed.'),
  changeDate: z.string().describe('The effective date of the change (format AAAA-MM-DD).'),
  changeDetails: z.string().describe('A string containing the details of the change, e.g., "Alteração de contrato: Novo cargo: Analista de RH Novo salário: R$ 5500"'),
});
export type ContractChangeInput = z.infer<typeof ContractChangeInputSchema>;

const S2206DataSchema = z.object({
  evtAltContratual: z.object({
    ideVinculo: z.object({
      cpfTrab: z.string().describe('CPF do Trabalhador.'),
      matricula: z.string().describe('Matrícula do trabalhador na empresa.'),
    }),
    altContratual: z.object({
      dtAlteracao: z.string().describe('Data da alteração no formato AAAA-MM-DD.'),
      vinculo: z.object({
        tpRegTrab: z.literal(1).describe('Tipo de Regime Trabalhista (1 para CLT).'),
      }),
      remuneracao: z.object({
        vrSalFx: z.number().describe('Novo valor do salário base.'),
        undSalFixo: z.literal(7).describe('Unidade de pagamento (7 para Mensal).'),
      }).optional(),
      infoRegimeTrab: z.object({
        infoCeletista: z.object({
            cargo: z.object({
                codCargo: z.string().describe("Código do novo cargo."),
                nmCargo: z.string().describe("Nome do novo cargo."),
            }).optional(),
            horario: z.object({
                codHorContrat: z.string().describe('Código do novo horário de trabalho contratual.'),
            }).optional(),
        })
      }).optional()
    }),
  }),
});

export type ContractChangeData = z.infer<typeof S2206DataSchema>;

export async function generateContractChangeData(input: ContractChangeInput): Promise<ContractChangeData> {
  return generateContractChangeFlow(input);
}

// In a real app, this would fetch data from a database
const getEmployeeForContractChange = (employeeId: string) => {
    const mockDatabase: Record<string, any> = {
        'FUNC001': {
            cpf: '111.222.333-44',
            matricula: 'M-1001',
            roleId: 'CAR001',
            roleName: 'Desenvolvedor Front-end',
            salary: 5000.00
        },
    };
    return mockDatabase[employeeId] || null;
}

const extractChangeInfo = (details: string) => {
    const salaryMatch = details.match(/Novo salário: R\$ (\d+\.?\d*)/);
    const roleMatch = details.match(/Novo cargo: ([\w\s]+)/);

    const newSalary = salaryMatch ? parseFloat(salaryMatch[1]) : undefined;
    const newRole = roleMatch ? roleMatch[1].trim() : undefined;
    
    return { newSalary, newRole };
}


const prompt = ai.definePrompt({
  name: 'esocialS2206Prompt',
  input: { schema: z.any() }, 
  output: { schema: S2206DataSchema },
  prompt: `
    Você é um especialista em eSocial. Sua tarefa é gerar os dados para o evento S-2206 (Alteração de Contrato de Trabalho) com base nas informações fornecidas.
    Gere apenas os blocos de informação que sofreram alteração (salário, cargo ou jornada). Se o salário não mudou, omita o bloco 'remuneracao'. Se o cargo não mudou, omita o bloco 'cargo'.

    Use os seguintes dados como fonte:
    \`\`\`json
    {{{json input}}}
    \`\`\`

    Observações importantes:
    - O campo 'cpfTrab' e 'matricula' são obrigatórios no 'ideVinculo'.
    - O campo 'dtAlteracao' é obrigatório.
    - Se o salário mudou, inclua o bloco 'remuneracao'. O valor 'vrSalFx' deve ser o novo salário.
    - Se o cargo mudou, inclua o bloco 'infoRegimeTrab.infoCeletista.cargo'.
    - O 'codCargo' deve ser um código simulado com base no nome do novo cargo (ex: 'CAR-ANALRH' para 'Analista de RH').

    Gere o objeto JSON correspondente ao schema de saída.
  `,
});

const generateContractChangeFlow = ai.defineFlow(
  {
    name: 'generateContractChangeFlow',
    inputSchema: ContractChangeInputSchema,
    outputSchema: S2206DataSchema,
  },
  async (input) => {
    const employeeData = getEmployeeForContractChange(input.employeeId);

    if (!employeeData) {
        throw new Error(`Employee with ID ${input.employeeId} not found.`);
    }

    const { newSalary, newRole } = extractChangeInfo(input.changeDetails);
    
    const newRoleCode = newRole ? `CAR-${newRole.replace(/\s+/g, '').toUpperCase().substring(0,6)}` : undefined;

    const promptData = {
      employeeId: input.employeeId,
      changeDate: input.changeDate,
      employee: {
        cpf: employeeData.cpf.replace(/\D/g, ''),
        matricula: employeeData.matricula,
      },
      ...(newSalary && { newSalary: newSalary }),
      ...(newRole && { newRoleInfo: { codCargo: newRoleCode, nmCargo: newRole } }),
    };

    const { output } = await prompt(promptData);
    
    return output!;
  }
);
