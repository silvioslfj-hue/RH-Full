
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
  newSalary: z.number().optional().describe('The new base salary, if changed.'),
  newRole: z.string().optional().describe('The new job role title, if changed.'),
  newWorkShiftId: z.string().optional().describe('The ID of the new work shift, if changed.'),
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

const prompt = ai.definePrompt({
  name: 'esocialS2206Prompt',
  input: { schema: z.any() }, 
  output: { schema: S2206DataSchema },
  prompt: `
    Você é um especialista em eSocial. Sua tarefa é gerar os dados para o evento S-2206 (Alteração de Contrato de Trabalho) com base nas informações fornecidas.
    Gere apenas os blocos de informação que sofreram alteração (salário, cargo ou jornada).

    Use os seguintes dados como fonte:
    \`\`\`json
    {{{json input}}}
    \`\`\`

    Observações importantes:
    - O campo 'cpfTrab' e 'matricula' são obrigatórios no 'ideVinculo'.
    - O campo 'dtAlteracao' é obrigatório.
    - Se o salário mudou, inclua o bloco 'remuneracao'.
    - Se o cargo ou jornada mudaram, inclua o bloco 'infoRegimeTrab.infoCeletista'.

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

    const promptData = {
      ...input,
      employee: {
        cpf: employeeData.cpf.replace(/\D/g, ''),
        matricula: employeeData.matricula,
      },
      // Pass role info if it changes
      ...(input.newRole && { newRoleInfo: { codCargo: "CAR-NEW", nmCargo: input.newRole } }),
      // Pass work shift info if it changes
      ...(input.newWorkShiftId && { newWorkShiftInfo: { codHorContrat: input.newWorkShiftId } }),
    };

    const { output } = await prompt(promptData);
    
    return output!;
  }
);
