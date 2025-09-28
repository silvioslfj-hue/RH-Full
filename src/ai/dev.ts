import { config } from 'dotenv';
config();

import '@/ai/flows/timecard-refactoring.ts';
import '@/ai/flows/payroll-flow.ts';
import '@/ai/flows/esocial-event-flow.ts';
import '@/ai/flows/contract-change-flow.ts';
import '@/ai/flows/fiscal-file-flow.ts';
import '@/ai/flows/proof-generation-flow.ts';
import '@/ai/flows/payslip-generation-flow.ts';
import '@/ai/flows/income-report-flow.ts';
import '@/ai/flows/job-opening-flow.ts';
