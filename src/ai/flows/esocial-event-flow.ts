'use server';

/**
 * @fileOverview An eSocial event data generation AI agent.
 * 
 * - generateESocialEventData - Generates structured data for an eSocial event.
 * - ESocialEventInput - The input type for the function.
 * - ESocialEventData - The return type for the function (structured data).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ESocialEventInputSchema = z.object({
  employeeId: z.string().describe('The ID of the employee for whom to generate the event data.'),
});
export type ESocialEventInput = z.infer<typeof ESocialEventInputSchema>;

// Simplified schema for S-2200 event (Admission) for demonstration purposes.
// A real implementation would be much more complex and cover all required fields.
const S2200DataSchema = z.object({
  evtAdmissao: z.object({
    ideEmpregador: z.object({
      tpInsc: z.literal(1).describe('Tipo de Inscrição do Empregador (1 para CNPJ).'),
      nrInsc: z.string().describe('Número de inscrição do empregador (CNPJ).'),
    }),
    trabalhador: z.object({
      cpfTrab: z.string().describe('CPF do Trabalhador.'),
      nmTrab: z.string().describe('Nome do Trabalhador.'),
      sexo: z.enum(['M', 'F']).describe('Sexo do Trabalhador (M - Masculino, F - Feminino).'),
      dtNascto: z.string().describe('Data de Nascimento no formato AAAA-MM-DD.'),
      nacionalidade: z.string().describe('Código da nacionalidade (ex: 10 para Brasileiro).'),
    }),
    vinculo: z.object({
      matricula: z.string().describe('Matrícula do trabalhador na empresa.'),
      tpRegTrab: z.literal(1).describe('Tipo de Regime Trabalhista (1 para CLT).'),
      dtAdm: z.string().describe('Data de Admissão no formato AAAA-MM-DD.'),
      salarioBase: z.number().describe('Salário base contratual do trabalhador.'),
      undSalFixo: z.literal(7).describe('Unidade de pagamento da parte fixa da remuneração (7 para Mensal).'),
      horario: z.object({
          codHorContrat: z.string().describe('Código do horário de trabalho contratual.'),
          dscJorn: z.string().describe('Descrição da jornada de trabalho (dias, horários).')
      })
    }),
  }),
});

export type ESocialEventData = z.infer<typeof S2200DataSchema>;

export async function generateESocialEventData(input: ESocialEventInput): Promise<ESocialEventData> {
  return generateESocialEventFlow(input);
}

// In a real app, this would fetch data from a database.
const getEmployeeDataForESocial = (employeeId: string) => {
    // This is a simulation. We're returning hardcoded data for 'FUNC001'.
    if (employeeId === 'FUNC001') {
        return {
            employee: {
                id: 'FUNC001',
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
                cpf: '123.456.789-00',
                birthDate: '1990-05-20',
                gender: 'F',
                nationality: 'Brasileira',
            },
            company: {
                name: 'RH-Full Soluções em TI',
                cnpj: '01.234.567/0001-89',
            },
            contract: {
                admissionDate: '2023-01-10',
                salary: 7500.00,
                workShiftId: 'JOR001'
            },
            workShift: {
                id: "JOR001",
                name: "Padrão (Seg-Sex, 8h/dia)",
                description: "Segunda a Sexta, das 09:00 às 18:00 com 1h de intervalo."
            }
        };
    }
    return null;
}


const prompt = ai.definePrompt({
  name: 'esocialS2200Prompt',
  input: { schema: z.any() }, // Input is the fetched employee data object
  output: { schema: S2200DataSchema },
  prompt: `
    Você é um especialista em eSocial. Sua tarefa é gerar os dados para o evento S-2200 (Admissão) com base nas informações do funcionário e da empresa fornecidas.
    Preencha todos os campos do schema de saída (output schema) com precisão.

    Use os seguintes dados como fonte:
    \`\`\`json
    {{{json input}}}
    \`\`\`

    Observações importantes:
    - O campo 'tpInsc' do empregador deve ser 1 (CNPJ).
    - O campo 'nrInsc' deve ser o CNPJ da empresa, sem formatação.
    - O campo 'cpfTrab' deve ser o CPF do trabalhador, sem formatação.
    - O campo 'sexo' deve ser 'M' para Masculino ou 'F' para Feminino.
    - O campo 'nacionalidade' deve ser o código '10'.
    - O campo 'tpRegTrab' deve ser 1 (CLT).
    - O campo 'undSalFixo' deve ser 7 (Mensal).
    - O campo 'codHorContrat' deve ser o ID da jornada de trabalho.
    - O campo 'dscJorn' deve ser a descrição da jornada.

    Gere o objeto JSON correspondente ao schema de saída.
  `,
});

const generateESocialEventFlow = ai.defineFlow(
  {
    name: 'generateESocialEventFlow',
    inputSchema: ESocialEventInputSchema,
    outputSchema: S2200DataSchema,
  },
  async ({ employeeId }) => {
    // 1. Fetch all necessary data for the employee from the database.
    // This is a simulation. In a real app, this would be a database query.
    const employeeFullData = getEmployeeDataForESocial(employeeId);

    if (!employeeFullData) {
        throw new Error(`Employee with ID ${employeeId} not found.`);
    }

    // 2. Prepare the data for the prompt, removing formatting from CNPJ and CPF.
    const promptData = {
        ...employeeFullData,
        company: {
            ...employeeFullData.company,
            cnpj: employeeFullData.company.cnpj.replace(/\D/g, ''),
        },
        trabalhador: {
            ...employeeFullData.employee,
            cpf: employeeFullData.employee.cpf.replace(/\D/g, ''),
        }
    };

    // 3. Call the AI prompt to generate the structured eSocial data.
    const { output } = await prompt(promptData);
    
    // 4. Return the structured data.
    return output!;
  }
);
