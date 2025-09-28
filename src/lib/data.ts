
import type { ClockEvent } from "@/components/dashboard/clock-widget";

export const summaryData = [
    { title: "Horas Esta Semana", value: "32.5", change: "+5.2%", changeType: "positive" },
    { title: "Próxima Folga", value: "2 dias", change: "Próximo: 25 de Julho", changeType: "neutral" },
    { title: "Horas Extras", value: "4.5", change: "-1.0%", changeType: "negative" },
    { title: "Aprovações Pendentes", value: "3", change: "Solicitações de Ausência", changeType: "neutral" },
];

export const absenceData = [
  { id: "ABS001", employee: "Alice Johnson", startDate: "2024-07-25", endDate: "2024-07-26", type: "Férias", status: "Aprovado" },
  { id: "ABS002", employee: "Bob Williams", startDate: "2024-08-01", endDate: "2024-08-01", type: "Licença Médica", status: "Pendente" },
  { id: "ABS003", employee: "Charlie Brown", startDate: "2024-07-22", endDate: "2024-07-22", type: "Pessoal", status: "Negado" },
  { id: "ABS004", employee: "Diana Miller", startDate: "2024-08-05", endDate: "2024-08-09", type: "Férias", status: "Pendente" },
  { id: "ABS005", employee: "Ethan Davis", startDate: "2024-07-29", endDate: "2024-07-29", type: "Licença Médica", status: "Aprovado" },
  { id: "ABS006", employee: "Fiona Garcia", startDate: "2024-08-12", endDate: "2024-08-12", type: "Pessoal", status: "Pendente" },
];

export const attendanceReportData = [
  { date: "Jul 15", Presentes: 95, Ausentes: 5 },
  { date: "Jul 16", Presentes: 98, Ausentes: 2 },
  { date: "Jul 17", Presentes: 97, Ausentes: 3 },
  { date: "Jul 18", Presentes: 94, Ausentes: 6 },
  { date: "Jul 19", Presentes: 99, Ausentes: 1 },
  { date: "Jul 22", Presentes: 96, Ausentes: 4 },
  { date: "Jul 23", Presentes: 100, Ausentes: 0 },
];

export const timeOffReportData = [
    { type: "Férias", count: 45, fill: "hsl(var(--chart-1))" },
    { type: "Licença Médica", count: 30, fill: "hsl(var(--chart-2))" },
    { type: "Pessoal", count: 15, fill: "hsl(var(--chart-4))" },
    { type: "Não Remunerada", count: 10, fill: "hsl(var(--chart-5))" },
];

export const initialTimecardData = `
Relatório de Ponto Semanal:

Funcionário: João Silva, ID: 123
- 22/07/2024: Entrada 09:03, Saída 17:05
- 23/07/2024: 08:55 AM às 05:00 PM (Almoço 12:00-13:00)
- 24/07/2024: 09:00-17:00

Funcionária: Maria Oliveira, ID: 456
- 22/07, das 9hr até 17hr
- 23/07, chegou 8:50, saiu 17:02. Intervalo de 1h.
- 24/07, médica, das 14h as 15h. expediente: 9h as 18h

Anotações avulsas:
Carlos (ID 789), 22/07: 9:15-17:15.
`;

export const todaysActivityData: ClockEvent[] = [
    { time: "09:01:12", type: "Entrada" },
    { time: "12:32:45", type: "Saída" },
    { time: "13:33:10", type: "Entrada" },
];

