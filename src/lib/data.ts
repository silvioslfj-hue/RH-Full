
import type { ClockEvent } from "@/components/dashboard/clock-widget";

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

export const summaryData = [
    { title: "Horas Esta Semana", value: "32.5", change: "+5.2%", changeType: "positive" },
    { title: "Próxima Folga", value: "2 dias", change: "Próximo: 25 de Julho", changeType: "neutral" },
    { title: "Horas Extras", value: "4.5", change: "-1.0%", changeType: "negative" },
    { title: "Aprovações Pendentes", value: "3", change: "Solicitações de Ausência", changeType: "neutral" },
];

export const absenceData = [
  { id: "ABS001", employee: "Alice Johnson", startDate: "2024-07-25", endDate: "2024-07-26", type: "Férias", status: "Aprovado" },
  { id: "ABS002", employee: "Bob Williams", startDate: "2024-08-01", endDate: "2024-08-01", type: "Licença Médica", status: "Pendente" },
  { id: "ABS003", employee: "Jane Doe", startDate: "2024-07-22", endDate: "2024-07-22", type: "Pessoal", status: "Negado" },
  { id: "ABS004", employee: "Diana Miller", startDate: "2024-08-05", endDate: "2024-08-09", type: "Férias", status: "Pendente" },
  { id: "ABS005", employee: "Jane Doe", startDate: "2024-07-29", endDate: "2024-07-29", type: "Licença Médica", status: "Aprovado" },
  { id: "ABS006", employee: "Fiona Garcia", startDate: "2024-08-12", endDate: "2024-08-12", type: "Pessoal", status: "Pendente" },
];

export const teamStatusData = [
  { name: "Alice Johnson", status: "Trabalhando", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { name: "Bob Williams", status: "Trabalhando", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
  { name: "Charlie Brown", status: "De folga", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d" },
  { name: "Diana Miller", status: "Em pausa", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d" },
  { name: "Ethan Hunt", status: "Ausente (Licença Médica)", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026708d" },
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

export const initialTimecardData = `Exemplo de dados de vários funcionários em formatos diferentes:

Funcionário: João Silva, ID: 123
- 22/07/2024: Entrada 09:03, Saída 17:05
- 23/07/2024: 08:55 AM às 05:00 PM (Almoço 12:00-13:00)
- 24/07/2024: 09:00-17:00

Funcionária: Maria Oliveira, ID: 456
- 22/07, das 9hr até 17hr
- 23/07, chegou 8:50, saiu 17:02. Intervalo de 1h.
- 24/07, atestado médico, ausente das 14h as 15h, trabalhou no resto do dia (9h às 18h).

Anotações avulsas de Carlos (ID 789)
- 22/07: 9:15-17:15.
- 23/07: Chegou 15 min atrasado.
`;

export const todaysActivityData: ClockEvent[] = [
    { time: "09:01:12", type: "Entrada" },
    { time: "12:32:45", type: "Saída" },
    { time: "13:33:10", type: "Entrada" },
];

export const personalTimeReportData = {
    workedHours: "128h 30m",
    timeBank: "12h 45m",
    timeBankChange: "+2h 15m este mês",
    timeBankChangeType: "positive",
};

export const lateAverageData = [
    { month: "Jan", "Média de Atraso": 2.5 },
    { month: "Fev", "Média de Atraso": 3.1 },
    { month: "Mar", "Média de Atraso": 1.8 },
    { month: "Abr", "Média de Atraso": 4.2 },
    { month: "Mai", "Média de Atraso": 1.5 },
    { month: "Jun", "Média de Atraso": 2.0 },
];

export const personalTimeOffData = [
    { type: "Férias", count: 10, fill: "hsl(var(--chart-1))" },
    { type: "Licença Médica", count: 2, fill: "hsl(var(--chart-2))" },
    { type: "Pessoal", count: 0, fill: "hsl(var(--chart-4))" },
];

export const unitData: Unit[] = [
    { id: "UN001", name: "Matriz São Paulo", address: "Av. Paulista, 1100", city: "São Paulo", state: "SP", zip: "01310-100" },
    { id: "UN002", name: "Filial Rio de Janeiro", address: "Av. Rio Branco, 1", city: "Rio de Janeiro", state: "RJ", zip: "20090-003" },
    { id: "UN003", name: "Escritório Belo Horizonte", address: "Av. Afonso Pena, 4000", city: "Belo Horizonte", state: "MG", zip: "30130-009" },
]

export const roleData: Role[] = [
    { id: "CAR001", name: "Desenvolvedor Front-end", department: "Tecnologia", description: "Desenvolve a interface do usuário e a experiência do cliente." },
    { id: "CAR002", name: "Desenvolvedor Back-end", department: "Tecnologia", description: "Gerencia a lógica do servidor, banco de dados e APIs." },
    { id: "CAR003", name: "Designer de Produto", department: "Produto", description: "Cria a experiência do usuário e o design visual dos produtos." },
    { id: "CAR004", name: "Analista de RH", department: "Recursos Humanos", description: "Gerencia o recrutamento, a folha de pagamento e as relações com os funcionários." },
]

export const companyData: Company[] = [
    { id: "EMP001", name: "RH-Full Soluções em TI", cnpj: "01.234.567/0001-89", address: "Av. Principal, 123", city: "São Paulo", state: "SP", zip: "01000-000", certificateFile: "rh_full_cert.pfx" },
    { id: "EMP002", name: "InovaTech Consultoria", cnpj: "98.765.432/0001-10", address: "Rua da Inovação, 456", city: "Rio de Janeiro", state: "RJ", zip: "20000-000" }
]
