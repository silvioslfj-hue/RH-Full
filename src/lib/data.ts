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

export const initialTimecardData = `{
    "employeeId": "EMP123",
    "payPeriod": "2024-07-01_2024-07-15",
    "entries": [
        "2024-07-08: IN 09:01, OUT 17:03",
        "2024-07-09: 09:00 AM to 05:00 PM",
        "2024-07-10 08:55-17:05",
        {"date": "2024-07-11", "start": "09:05", "end": "16:58"},
        "July 12, 2024 - 9 to 5"
    ]
}`;
