import type { ClockEvent } from "@/components/dashboard/clock-widget";
import type { PayrollOutput } from "@/ai/flows/payroll-flow";
import { z } from 'zod';

export type Unit = {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}

export type Role = {
    id: string;
    name: string;
    department: string;
    description: string;
}

export type Manager = {
    id: string;
    name: string;
    department: string;
}

export type Company = {
    id: string;
    name: string;
    cnpj: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    certificateFile?: string;
}

export type WorkShift = {
  id: string;
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
  breakDuration: number; // in minutes
  tolerance: number; // in minutes
}

export type Employee = {
    id: string;
    name: string;
    email: string;
    company: string;
    role: string;
    unit: string;
    status: 'Ativo' | 'Inativo' | 'Férias';
    contractType: 'CLT' | 'PJ';
    avatar?: string;
}

export type Absence = {
    id: string;
    employee: string;
    startDate: string;
    endDate: string;
    type: string;
    status: 'Aprovado' | 'Pendente' | 'Negado';
};

export type EsocialEvent = {
  id: string;
  type: string;
  employeeName: string;
  employeeId: string; // The ID of the employee to fetch full data
  referenceDate: string;
  status: 'Pendente' | 'Processando' | 'XML Gerado' | 'Erro' | 'Rejeitado';
  details: string;
  xmlContent?: string;
};

export type PayrollHistory = {
  id: string;
  competence: string;
  employeeId: string;
  employeeName: string;
  grossSalary: number;
  netSalary: number;
  status: "Finalizado" | "Pendente";
  payrollData?: PayrollOutput;
};

export type Invoice = {
    id: string;
    employeeId: string;
    competence: string;
    amount: number;
    uploadDate: string;
    status: 'Enviado' | 'Processando' | 'Pago' | 'Erro';
    fileName: string;
}

export type TimeSheetEntry = {
    day: string;
    date: string;
    entries: string;
    worked: string;
    balance: string;
    status: "ok" | "warning" | "info";
    issue?: string;
};

export type TimeBankEntry = {
    employeeId: string;
    employeeName: string;
    role: string;
    avatar?: string;
    balance: string;
    expiringHours: string;
    expiryDate: string;
    status: 'Crítico' | 'Atenção' | 'OK';
}

export type DisciplinaryAction = {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    type: 'Advertência Verbal' | 'Advertência Escrita' | 'Suspensão';
    reason: string;
    issuer: string;
}

export type AdjustmentRequest = {
    id: string;
    date: string;
    reason: string;
    requester: string;
};


// Types for payslip generation
export const PayslipGenerationInputSchema = z.object({
  company: z.object({
    name: z.string().describe("Nome da empresa empregadora."),
    cnpj: z.string().describe("CNPJ da empresa empregadora."),
  }),
  employee: z.object({
    name: z.string().describe("Nome do funcionário."),
    role: z.string().describe("Cargo do funcionário."),
  }),
  competence: z.string().describe("Mês/Ano de referência da folha (ex: Julho/2024)."),
  payrollData: z.object({
    grossSalary: z.number(),
    earnings: z.array(z.object({ name: z.string(), value: z.number() })),
    deductions: z.array(z.object({ name: z.string(), value: z.number() })),
    totalEarnings: z.number(),
    totalDeductions: z.number(),
    netSalary: z.number(),
  }),
});
export type PayslipGenerationInput = z.infer<typeof PayslipGenerationInputSchema>;

export const PayslipGenerationOutputSchema = z.object({
  payslipContent: z.string().describe('O conteúdo textual completo do holerite, formatado para exibição e com quebras de linha (\\n).'),
});
export type PayslipGenerationOutput = z.infer<typeof PayslipGenerationOutputSchema>;


// Types for Income Report Generation
export const IncomeReportInputSchema = z.object({
  employeeId: z.string().describe('The ID of the employee.'),
  year: z.number().describe('The calendar year for the report.'),
});
export type IncomeReportInput = z.infer<typeof IncomeReportInputSchema>;

export const IncomeReportOutputSchema = z.object({
  fileName: z.string().describe('The suggested file name (e.g., "Informe_Rendimentos_2023.txt").'),
  reportContent: z.string().describe('The full text content of the generated income report, formatted as a single string with line breaks (\\n).'),
});
export type IncomeReportOutput = z.infer<typeof IncomeReportOutputSchema>;

// Types for Proof Generation
export const ProofGenerationInputSchema = z.object({
  proofId: z.string().describe('The unique ID of the proof record (e.g., CMP001).'),
  employeeId: z.string().describe('The ID of the employee.'),
  timestamp: z.string().describe('The ISO 8601 timestamp of the clock-in event.'),
});
export type ProofGenerationInput = z.infer<typeof ProofGenerationInputSchema>;

export const ProofGenerationOutputSchema = z.object({
  fileName: z.string().describe('The suggested file name (e.g., "Comprovante_CMP001.txt").'),
  proofContent: z.string().describe('The full text content of the generated proof, formatted as a single string with line breaks (\\n).'),
});
export type ProofGenerationOutput = z.infer<typeof ProofGenerationOutputSchema>;


// Types for Job Opening Generation
export const JobOpeningInputSchema = z.object({
  role: z.string().describe('The job title for which to generate the materials (e.g., "Senior AI Developer").'),
});
export type JobOpeningInput = z.infer<typeof JobOpeningInputSchema>;

export const JobOpeningOutputSchema = z.object({
  description: z.string().describe('A complete and attractive job description, including responsibilities, qualifications, and benefits. Format using Markdown.'),
  interviewQuestions: z.array(z.object({
    category: z.string().describe('The category of the question (e.g., "Technical", "Behavioral").'),
    question: z.string().describe('The interview question.'),
  })).describe('A list of suggested interview questions.'),
  requiredSkills: z.array(z.string()).describe('A list of essential skills and competencies for the role.'),
});
export type JobOpeningOutput = z.infer<typeof JobOpeningOutputSchema>;

export type GeneratedJobOpening = JobOpeningOutput & {
    id: string;
    role: string;
    createdAt: string;
}


// This file now only contains type definitions.
// All mock data has been removed and pages are connected to Firestore.

export const initialTimecardData = ``;

export const timeSheetData: TimeSheetEntry[] = [
  { day: "Seg", date: "22/07", entries: "09:01 - 12:32 - 13:33 - 18:05", worked: "08:03", balance: "+00:03", status: 'ok' },
  { day: "Ter", date: "23/07", entries: "08:58 - 12:30 - 13:30 - 17:59", worked: "07:59", balance: "-00:01", status: 'ok' },
  { day: "Qua", date: "24/07", entries: "09:15 - 12:35 - 13:40 - 18:10", worked: "07:50", balance: "-00:10", status: 'warning', issue: 'Atraso' },
  { day: "Qui", date: "25/07", entries: "09:00 - 12:30 - 13:30", worked: "03:30", balance: "-04:30", status: 'warning', issue: 'Incompleto' },
  { day: "Sex", date: "26/07", entries: "Ausente", worked: "00:00", balance: "-08:00", status: 'info', issue: 'Falta' },
];

export const companyData: Company[] = [
    { id: '1', name: 'RH Lite Soluções em TI', cnpj: '01.234.567/0001-89', address: 'Av. Principal', city: 'São Paulo', state: 'SP', zip: '01234-567', certificateFile: 'cert1.pfx' },
    { id: '2', name: 'Inova Tech', cnpj: '98.765.432/0001-10', address: 'Rua das Inovações', city: 'Rio de Janeiro', state: 'RJ', zip: '98765-432' },
];

export const unitData: Unit[] = [
    { id: '1', name: 'Sede São Paulo', address: 'Av. Principal, 123', city: 'São Paulo', state: 'SP', zip: '01234-567' },
    { id: '2', name: 'Filial Remota', address: 'N/A', city: 'Remoto', state: 'N/A', zip: 'N/A' },
];

export const employeeData: Employee[] = [
    { id: 'FUNC001', name: 'Carlos Andrade', email: 'carlos.andrade@example.com', company: 'RH Lite Soluções em TI', role: 'Desenvolvedor Backend', unit: 'Sede São Paulo', status: 'Ativo', contractType: 'CLT', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'FUNC002', name: 'Mariana Costa', email: 'mariana.costa@example.com', company: 'RH Lite Soluções em TI', role: 'Designer UI/UX', unit: 'Sede São Paulo', status: 'Férias', contractType: 'CLT', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { id: 'FUNC003', name: 'Pedro Alves', email: 'pedro.alves@example.com', company: 'RH Lite Soluções em TI', role: 'Gerente de Projetos', unit: 'Filial Remota', status: 'Ativo', contractType: 'CLT', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    { id: 'FUNC004', name: 'Juliana Lima', email: 'juliana.lima@example.com', company: 'RH Lite Soluções em TI', role: 'Analista de RH', unit: 'Sede São Paulo', status: 'Inativo', contractType: 'CLT', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
    { id: 'FUNC005', name: 'Fernando Oliveira', email: 'fernando.oliveira@example.com', company: 'Inova Tech', role: 'Engenheiro de IA', unit: 'Filial Remota', status: 'Ativo', contractType: 'PJ', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d' },
];

export const teamStatusData = [
  { name: "Carlos Andrade", status: "Trabalhando", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { name: "Mariana Costa", status: "Ausente - Férias", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
  { name: "Pedro Alves", status: "Em pausa", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d" },
  { name: "Lucas Ferreira", status: "De folga", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026709d" },
];

export const absenceData: Absence[] = [
  { id: '1', employee: 'Carlos Andrade', startDate: '2024-08-01', endDate: '2024-08-05', type: 'Licença Médica', status: 'Aprovado' },
  { id: '2', employee: 'Mariana Costa', startDate: '2024-08-10', endDate: '2024-08-20', type: 'Férias', status: 'Pendente' },
  { id: '3', employee: 'Pedro Alves', startDate: '2024-07-29', endDate: '2024-07-29', type: 'Licença Pessoal', status: 'Negado' },
];

export const attendanceReportData = [
  { date: '20 Jul', Presentes: 88, Ausentes: 12 },
  { date: '21 Jul', Presentes: 92, Ausentes: 8 },
  { date: '22 Jul', Presentes: 90, Ausentes: 10 },
  { date: '23 Jul', Presentes: 85, Ausentes: 15 },
  { date: '24 Jul', Presentes: 95, Ausentes: 5 },
  { date: '25 Jul', Presentes: 91, Ausentes: 9 },
  { date: '26 Jul', Presentes: 89, Ausentes: 11 },
];

export const timeOffReportData = [
  { type: 'Férias', count: 45, fill: 'var(--color-Férias)' },
  { type: 'Licença Médica', count: 25, fill: 'var(--color-Licença Médica)' },
  { type: 'Pessoal', count: 20, fill: 'var(--color-Pessoal)' },
  { type: 'Não Remunerada', count: 10, fill: 'var(--color-Não Remunerada)' },
];

export const timeBankData: TimeBankEntry[] = [
    { employeeId: 'FUNC001', employeeName: 'Carlos Andrade', role: 'Desenvolvedor Backend', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', balance: '+12h 30m', expiringHours: '04h 15m', expiryDate: '31/08/2024', status: 'Crítico' },
    { employeeId: 'FUNC002', employeeName: 'Mariana Costa', role: 'Designer UI/UX', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', balance: '-02h 00m', expiringHours: '00h 00m', expiryDate: '-', status: 'OK' },
    { employeeId: 'FUNC003', employeeName: 'Pedro Alves', role: 'Gerente de Projetos', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', balance: '+35h 45m', expiringHours: '10h 30m', expiryDate: '15/09/2024', status: 'Atenção' },
    { employeeId: 'FUNC005', employeeName: 'Fernando Oliveira', role: 'Engenheiro de IA', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', balance: '+08h 15m', expiringHours: '00h 00m', expiryDate: '-', status: 'OK' },
]

export const personalTimeReportData = {
    workedHours: '128h 45m',
    timeBank: '+18h 30m',
    timeBankChange: '+2h 15m vs. last month',
    timeBankChangeType: 'positive',
};

export const lateAverageData = [
    { month: 'Fev', 'Média de Atraso': 5 },
    { month: 'Mar', 'Média de Atraso': 7 },
    { month: 'Abr', 'Média de Atraso': 4 },
    { month: 'Mai', 'Média de Atraso': 6 },
    { month: 'Jun', 'Média de Atraso': 3 },
    { month: 'Jul', 'Média de Atraso': 8 },
];

export const personalTimeOffData = [
  { type: 'Férias', count: 10, fill: 'hsl(var(--chart-1))' },
  { type: 'Licença Médica', count: 2, fill: 'hsl(var(--chart-2))' },
  { type: 'Pessoal', count: 1, fill: 'hsl(var(--chart-4))' },
];

    