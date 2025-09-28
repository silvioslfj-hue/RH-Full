

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
  status: 'Pendente' | 'Enviado' | 'Erro' | 'Rejeitado';
  details: string;
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


export const summaryData: any[] = [];

export const absenceData: any[] = [];

export const teamStatusData: any[] = [];


export const attendanceReportData: any[] = [];

export const timeOffReportData: any[] = [];

export const initialTimecardData = ``;

export const todaysActivityData: ClockEvent[] = [];

export const personalTimeReportData = {
    workedHours: "00h 00m",
    timeBank: "00h 00m",
    timeBankChange: "N/A",
    timeBankChangeType: "neutral",
};

export const lateAverageData: any[] = [];

export const personalTimeOffData: any[] = [];

export const unitData: Unit[] = [];

export const roleData: Role[] = [];

export const managerData: Manager[] = [];

export const companyData: Company[] = [];

export const workShiftData: WorkShift[] = [];

export const employeeData: Employee[] = [];

export const payrollHistoryData: PayrollHistory[] = [];

export const esocialEventsData: EsocialEvent[] = [];

export const timeSheetData: TimeSheetEntry[] = [];

export const jobOpeningsData: GeneratedJobOpening[] = [];

export const timeBankData: TimeBankEntry[] = [];

export const invoicesData: Invoice[] = [];

export const disciplinaryData: DisciplinaryAction[] = [];
    

    







    

    

