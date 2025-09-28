
'use server';

/**
 * @fileOverview A point-in-time proof generation AI agent.
 * 
 * - generateProofContent - Generates the text content for a point-in-time registration proof.
 * - ProofGenerationInput - The input type for the function.
 * - ProofGenerationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { employeeData, companyData } from '@/lib/data';
import type { ProofGenerationInput, ProofGenerationOutput } from '@/lib/data';
import { ProofGenerationInputSchema, ProofGenerationOutputSchema } from '@/lib/data';


export async function generateProofContent(input: ProofGenerationInput): Promise<ProofGenerationOutput> {
  return generateProofContentFlow(input);
}

// In a real app, this data would be fetched from a database.
const getFullProofData = (employeeId: string) => {
    const employee = employeeData.find(e => e.id === employeeId);
    if (!employee) return null;

    // Find the company the employee belongs to
    const company = companyData.find(c => c.name === employee.company);
    if (!company) return null;

    // This is a simulation. A real app would get CPF from employee's full data.
    const mockEmployeeDetails: Record<string, any> = {
        'FUNC001': { cpf: '111.222.333-44' },
        'FUNC002': { cpf: '555.666.777-88' },
    }

    return {
        employee: {
            name: employee.name,
            cpf: mockEmployeeDetails[employeeId]?.cpf || '000.000.000-00',
        },
        company: {
            name: company.name,
            cnpj: company.cnpj,
            address: `${company.address}, ${company.city} - ${company.state}`
        }
    };
};

const prompt = ai.definePrompt({
  name: 'proofGenerationPrompt',
  input: { schema: z.any() },
  output: { schema: ProofGenerationOutputSchema },
  prompt: `
    Você é um especialista em legislação trabalhista brasileira, especificamente na Portaria 671 do MTP, que define o layout do "Comprovante de Registro de Ponto do Trabalhador".

    Sua tarefa é gerar o CONTEÚDO TEXTUAL de um comprovante de ponto com base nos dados fornecidos. O comprovante deve ser uma única string, com cada linha separada por '\\n'.
    Siga RIGOROSAMENTE o formato e a ordem dos campos definidos pela Portaria 671.

    Dados para a geração do comprovante:
    - ID do Comprovante (usar como NSR): {{input.proofId}}
    - Data e Hora do Registro: {{input.isoTimestamp}}
    - Dados do Empregador:
        - Nome: {{input.fullData.company.name}}
        - CNPJ: {{input.fullData.company.cnpj}}
        - Endereço: {{input.fullData.company.address}}
    - Dados do Trabalhador:
        - Nome: {{input.fullData.employee.name}}
        - CPF: {{input.fullData.employee.cpf}}

    **Formato do Comprovante:**

    1. Título: "Comprovante de Registro de Ponto do Trabalhador"
    2. NSR (Número Sequencial de Registro)
    3. Nome do empregador
    4. CNPJ/CPF do empregador (sem formatação, apenas números)
    5. Local da prestação do serviço
    6. Nome do trabalhador
    7. CPF do trabalhador (sem formatação, apenas números)
    8. Data e Hora do registro (formato DD/MM/AAAA HH:mm:ss)
    
    Gere o conteúdo para o arquivo de texto e um nome de arquivo apropriado (ex: Comprovante_NOME_DATA.txt).
  `,
});

const generateProofContentFlow = ai.defineFlow(
  {
    name: 'generateProofContentFlow',
    inputSchema: ProofGenerationInputSchema,
    outputSchema: ProofGenerationOutputSchema,
  },
  async (input) => {
    // 1. Fetch all necessary data for the proof.
    const fullData = getFullProofData(input.employeeId);

    if (!fullData) {
        throw new Error(`Could not find full data for employee ID ${input.employeeId}`);
    }

    // 2. Prepare data for the prompt.
    const promptData = {
        ...input,
        isoTimestamp: input.timestamp,
        fullData: {
            ...fullData,
            company: {
                ...fullData.company,
                cnpj: fullData.company.cnpj.replace(/\D/g, ''),
            },
            employee: {
                ...fullData.employee,
                cpf: fullData.employee.cpf.replace(/\D/g, ''),
            }
        }
    };

    // 3. Call the AI to generate the structured file content.
    const { output } = await prompt(promptData);
    
    // 4. Return the structured data.
    return output!;
  }
);
