
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

export type WorkShift = {
  id: string;
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
  breakDuration: number; // in minutes
}

export type Employee = {
    id: string;
    name: string;
    email: string;
    company: string;
    role: string;
    unit: string;
    status: 'Ativo' | 'Inativo' | 'Férias';
    avatar?: string;
}

export type EsocialEvent = {
  id: string;
  type: string;
  employeeName: string;
  employeeId: string; // The ID of the employee to fetch full data
  referenceDate: string;
  status: 'Pendente' | 'Enviado' | 'Erro' | 'Rejeitado';
  details: string;
};


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

export const workShiftData: WorkShift[] = [
    { id: "JOR001", name: "Padrão (Seg-Sex, 8h/dia)", days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"], startTime: "09:00", endTime: "18:00", breakDuration: 60 },
    { id: "JOR002", name: "Meio Período (Seg-Sex, 4h/dia)", days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"], startTime: "09:00", endTime: "13:00", breakDuration: 0 },
    { id: "JOR003", name: "Plantão 12x36", days: ["Alternados"], startTime: "07:00", endTime: "19:00", breakDuration: 60 },
];

export const employeeData: Employee[] = [
    { id: "FUNC001", name: "Carlos Andrade", email: "carlos.andrade@example.com", company: "RH-Full Soluções em TI", role: "Desenvolvedor Back-end", unit: "Matriz São Paulo", status: "Ativo", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    { id: "FUNC002", name: "Mariana Costa", email: "mariana.costa@example.com", company: "InovaTech Consultoria", role: "Desenvolvedor Front-end", unit: "Filial Rio de Janeiro", status: "Ativo", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
    { id: "FUNC003", name: "Alice Johnson", email: "alice.johnson@example.com", company: "RH-Full Soluções em TI", role: "Designer de Produto", unit: "Matriz São Paulo", status: "Férias", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d" },
    { id: "FUNC004", name: "Robert Brown", email: "robert.brown@example.com", company: "InovaTech Consultoria", role: "Analista de RH", unit: "Escritório Belo Horizonte", status: "Inativo", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d" },
]

export const payrollHistoryData = [
  { id: "HIST001", competence: "Julho/2024", employeeId: "FUNC001", employeeName: "Jane Doe", grossSalary: 7500.00, netSalary: 5890.50, status: "Finalizado" },
  { id: "HIST002", competence: "Julho/2024", employeeId: "FUNC002", employeeName: "John Smith", grossSalary: 8200.00, netSalary: 6210.80, status: "Finalizado" },
  { id: "HIST003", competence: "Junho/2024", employeeId: "FUNC001", employeeName: "Jane Doe", grossSalary: 7500.00, netSalary: 5890.50, status: "Finalizado" },
  { id: "HIST004", competence: "Junho/2024", employeeId: "FUNC002", employeeName: "John Smith", grossSalary: 8000.00, netSalary: 6050.20, status: "Finalizado" },
  { id: "HIST005", competence: "Junho/2024", employeeId: "FUNC003", employeeName: "Alice Johnson", grossSalary: 6000.00, netSalary: 4850.00, status: "Finalizado" },
];

export const esocialEventsData: EsocialEvent[] = [
    { id: "EVT001", type: "S-2200 - Admissão", employeeName: "Carlos Andrade", employeeId: "FUNC001", referenceDate: "2024-07-01", status: "Pendente", details: "Admissão do novo analista de sistemas." },
    { id: "EVT002", type: "S-2200 - Admissão", employeeName: "Mariana Costa", employeeId: "FUNC002", referenceDate: "2024-07-01", status: "Pendente", details: "Admissão da nova designer." },
    { id: "EVT003", type: "S-2299 - Desligamento", employeeName: "Felipe Souza", employeeId: "FUNC005", referenceDate: "2024-07-15", status: "Pendente", details: "Desligamento a pedido do funcionário." },
    { id: "EVT004", type: "S-1200 - Remuneração", employeeName: "Carlos Andrade", employeeId: "FUNC001", referenceDate: "2024-07-31", status: "Pendente", details: "Folha de pagamento de Julho/2024" },
    { id: "EVT005", type: "S-1200 - Remuneração", employeeName: "Mariana Costa", employeeId: "FUNC002", referenceDate: "2024-07-31", status: "Pendente", details: "Folha de pagamento de Julho/2024" },
    { id: "EVT006", type: "S-1210 - Pagamentos", employeeName: "Todos", employeeId: "N/A", referenceDate: "2024-08-05", status: "Enviado", details: "Pagamento de salários de Julho/2024" },
]

    
