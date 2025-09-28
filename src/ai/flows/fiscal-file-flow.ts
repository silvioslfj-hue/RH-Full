
'use server';

/**
 * @fileOverview A fiscal file generation AI agent.
 * 
 * - generateFiscalFile - Generates file content for fiscal reporting (AEJ, AFDT, ACJEF).
 * - FiscalFileInput - The input type for the function.
 * - FiscalFileOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FiscalFileInputSchema = z.object({
  fileType: z.enum(['aej', 'afdt', 'acjef']).describe('The type of fiscal file to generate.'),
  startDate: z.string().describe('The start date for the reporting period (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for the reporting period (YYYY-MM-DD).'),
  companyCnpj: z.string().describe('The CNPJ of the company.'),
});
export type FiscalFileInput = z.infer<typeof FiscalFileInputSchema>;

const FiscalFileOutputSchema = z.object({
  fileName: z.string().describe('The suggested file name (e.g., "AEJ_DDMMYYYY_DDMMYYYY.txt").'),
  fileContent: z.string().describe('The full content of the generated fiscal file, formatted as a single string with line breaks (\\n).'),
});
export type FiscalFileOutput = z.infer<typeof FiscalFileOutputSchema>;

export async function generateFiscalFile(input: FiscalFileInput): Promise<FiscalFileOutput> {
  return generateFiscalFileFlow(input);
}

// In a real app, this would fetch all time clock entries for all employees in the date range.
// For this demo, we'll use a hardcoded sample.
const getMockTimecardDataForPeriod = (startDate: string, endDate: string) => {
    return [
        { cpf: "11122233344", date: "2024-07-22", time: "0901", type: "E" },
        { cpf: "11122233344", date: "2024-07-22", time: "1230", type: "S" },
        { cpf: "11122233344", date: "2024-07-22", time: "1330", type: "E" },
        { cpf: "11122233344", date: "2024-07-22", time: "1802", type: "S" },
        { cpf: "55566677788", date: "2024-07-22", time: "0858", type: "E" },
        { cpf: "55566677788", date: "2024-07-22", time: "1759", type: "S" },
    ];
}


const prompt = ai.definePrompt({
  name: 'fiscalFilePrompt',
  input: { schema: z.any() },
  output: { schema: FiscalFileOutputSchema },
  prompt: `
    Você é um especialista em legislação trabalhista brasileira, especificamente na Portaria 671 do MTP, que define os layouts para arquivos fiscais de jornada de trabalho.

    Sua tarefa é gerar o conteúdo de um arquivo fiscal do tipo {{input.fileType}} para o período de {{input.startDate}} a {{input.endDate}} para a empresa com CNPJ {{input.companyCnpj}}.
    O conteúdo do arquivo deve ser uma única string, com cada registro em uma nova linha (usando '\\n').
    Siga rigorosamente o layout definido pela Portaria 671.

    Dados de exemplo para a geração do arquivo:
    - Empresa: CNPJ {{input.companyCnpj}}, Razão Social: "RH-Full Soluções em TI", Endereço: "Av. Principal, 123"
    - Período: {{input.startDate}} a {{input.endDate}}
    - Marcações de Ponto:
    \`\`\`json
    {{{json input.timecardData}}}
    \`\`\`

    **Instruções para cada tipo de arquivo:**

    **AEJ (Arquivo Eletrônico de Jornada):**
    - **Registro Tipo 1 (Cabeçalho):** '1' + CNPJ/CPF do empregador (14 posições) + CEI/CAEPF/CNO (12 posições, em branco se não houver) + Razão Social (150 posições) + Data de Início (DDMMYYYY) + Data de Fim (DDMMYYYY) + Data e Hora da Geração (DDMMYYYYHHMMSS). Complete os espaços não utilizados com brancos.
    - **Registro Tipo 2 (Marcações de Jornada):** Para cada funcionário, um registro por dia. '2' + CPF (11 posições) + Data (DDMMYYYY) + Horários de entrada/saída (HHMMHHMM...).
    - **Registro Tipo 9 (Trailer):** '9' + Número total de registros tipo 2 + Número total de registros tipo 1 + '999999'.

    **AFDT (Arquivo Fonte de Dados Tratados):**
    - **Registro Tipo 1 (Cabeçalho):** Similar ao AEJ, mas o tipo de identificador (campo 2) é '1' para CNPJ.
    - **Registro Tipo 2 (Marcações de Ponto):** '2' + NSR (Número Sequencial do Registro, 9 posições) + Tipo de Marcação ('E' para Entrada, 'S' para Saída) + Data (DDMMYYYY) + Hora (HHMM) + CPF (11 posições).
    - **Registro Tipo 9 (Trailer):** '9' + Número total de registros.

    **ACJEF (Arquivo de Controle de Jornada para Efeitos Fiscais):**
    - **Registro Tipo 1 (Cabeçalho):** Similar aos outros, mas com campos adicionais para identificador do equipamento REP.
    - **Registro Tipo 2 (Total de Horas):** Um por funcionário. CPF + Código da Jornada + Total de horas (HHMM) para: normais, extras (50%, 100%, etc.), noturnas, faltas, etc.
    - **Registro Tipo 9 (Trailer):** Similar aos outros.

    Gere o conteúdo para o arquivo do tipo **{{input.fileType}}** e um nome de arquivo apropriado.
  `,
});


const generateFiscalFileFlow = ai.defineFlow(
  {
    name: 'generateFiscalFileFlow',
    inputSchema: FiscalFileInputSchema,
    outputSchema: FiscalFileOutputSchema,
  },
  async (input) => {
    // 1. Fetch the relevant timecard data for the period.
    const timecardData = getMockTimecardDataForPeriod(input.startDate, input.endDate);

    // 2. Prepare data for the prompt.
    const promptData = {
        ...input,
        timecardData,
    };

    // 3. Call the AI to generate the structured file content.
    const { output } = await prompt(promptData);
    
    // 4. Return the structured data.
    return output!;
  }
);
