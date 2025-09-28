
"use client";

import { useState, useTransition } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Building,
  Factory,
  Loader2,
  CheckCircle,
  FileText,
  AlertCircle,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePayroll, type PayrollInput, type PayrollOutput } from "@/ai/flows/payroll-flow";
import { employeeData, type Employee } from "@/lib/data";

type PayrollStatus = "Pendente" | "Processando" | "Concluído" | "Erro";
type EmployeePayroll = {
    id: string;
    name: string;
    role: string;
    grossSalary: number;
    status: PayrollStatus;
    contractType: Employee['contractType'];
    payrollData?: PayrollOutput;
};

const initialPayrollData: EmployeePayroll[] = employeeData.map(e => ({
  id: e.id,
  name: e.name,
  role: e.role,
  contractType: e.contractType,
  grossSalary: e.contractType === 'PJ' ? 12000.00 : 7500.00, // Salário de exemplo
  status: "Pendente",
}));


export default function PayrollPage() {
  const { toast } = useToast();
  const [payrollRun, setPayrollRun] = useState<EmployeePayroll[]>(initialPayrollData);
  const [isProcessing, startTransition] = useTransition();

  // Esta configuração agora viria das configurações globais. Para o protótipo, vamos fixá-la.
  const globalOvertimeAction = "pay"; 

  const handleProcessPayroll = () => {
    startTransition(() => {
        toast({
            title: "Processamento de Folha Iniciado",
            description: "A folha de pagamento para a competência selecionada está sendo processada.",
        });

        const processEmployee = async (employee: EmployeePayroll) => {
            setPayrollRun(prev => prev.map(e => e.id === employee.id ? { ...e, status: "Processando" } : e));
            
            toast({
                title: `Processando ${employee.name}...`,
                description: "IA está verificando as regras antes de calcular."
            });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula a verificação

            try {
                let input: PayrollInput;

                if (employee.contractType === 'CLT') {
                    // Simulação de busca de dados do ponto para CLT
                    const normalOvertimeHours = Math.floor(Math.random() * 10);
                    const holidayOvertimeHours = Math.random() > 0.7 ? Math.floor(Math.random() * 8) : 0; // 30% de chance
                    
                    input = {
                        employeeName: employee.name,
                        contractType: employee.contractType,
                        grossSalary: employee.grossSalary,
                        normalOvertimeHours,
                        holidayOvertimeHours,
                        overtimeAction: globalOvertimeAction,
                        benefits: {
                            valeTransporte: 150,
                            valeRefeicao: 440,
                        }
                    };
                } else { // PJ
                    // Simulação de dias trabalhados para PJ
                    const contractedWorkDays = 22;
                    const actualWorkedDays = Math.random() > 0.6 ? contractedWorkDays + Math.floor(Math.random() * 3) : contractedWorkDays; // 40% chance de dias extras

                     input = {
                        employeeName: employee.name,
                        contractType: employee.contractType,
                        grossSalary: employee.grossSalary,
                        contractedWorkDays,
                        actualWorkedDays,
                        overtimeAction: 'pay', // Irrelevante para PJ, mas o schema exige
                        benefits: {}
                    };
                }


                const result = await generatePayroll(input);

                setPayrollRun(prev => prev.map(e => e.id === employee.id ? { ...e, status: "Concluído", payrollData: result } : e));
            } catch (error) {
                console.error(`Erro ao processar folha para ${employee.name}:`, error);
                setPayrollRun(prev => prev.map(e => e.id === employee.id ? { ...e, status: "Erro" } : e));
            }
        };

        const runAll = async () => {
            for (const employee of payrollRun) {
                if (employee.status !== "Concluído") {
                    await processEmployee(employee);
                }
            }
            toast({
                title: "Processamento Concluído",
                description: "A folha de pagamento foi finalizada.",
            });
        }

        runAll();
    });
  };

  const handleExportCsv = () => {
    const completedPayrolls = payrollRun.filter(p => p.status === 'Concluído' && p.payrollData);

    if (completedPayrolls.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum dado para exportar",
        description: "Processe a folha de pagamento antes de exportar.",
      });
      return;
    }

    const headers = [
      "ID Funcionário", "Nome", "Salário Bruto", "Total Proventos", "Total Descontos", "Salário Líquido",
      "INSS", "IRRF", "FGTS (Informativo)"
    ];

    const rows = completedPayrolls.map(p => {
        const payroll = p.payrollData!;
        const inss = payroll.deductions.find(d => d.name.toUpperCase().includes('INSS'))?.value.toFixed(2) || '0.00';
        const irrf = payroll.deductions.find(d => d.name.toUpperCase().includes('IRRF'))?.value.toFixed(2) || '0.00';
        const fgts = payroll.deductions.find(d => d.name.toUpperCase().includes('FGTS'))?.value.toFixed(2) || '0.00';
        
        return [
          p.id,
          p.name,
          payroll.grossSalary.toFixed(2),
          payroll.totalEarnings.toFixed(2),
          payroll.totalDeductions.toFixed(2),
          payroll.netSalary.toFixed(2),
          inss,
          irrf,
          fgts
        ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_folha_pagamento.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

     toast({
        title: "Relatório Exportado",
        description: "O arquivo CSV foi baixado com sucesso.",
    });
  };

  const getStatusComponent = (status: PayrollStatus) => {
    switch (status) {
      case "Pendente":
        return <Badge variant="outline">Pendente</Badge>;
      case "Processando":
        return (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processando
          </Badge>
        );
      case "Concluído":
        return (
          <Badge variant="default" className="bg-green-600 hover:bg-green-600/90 gap-1">
            <CheckCircle className="h-3 w-3" />
            Concluído
          </Badge>
        );
      case "Erro":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Erro
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Folha de Pagamento
          </h1>
          <p className="text-muted-foreground">
            Calcule, processe e gerencie a folha de pagamento dos seus colaboradores com assistência de IA.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Processar Folha de Pagamento</CardTitle>
            <CardDescription>
              Selecione a competência e inicie o processamento. A IA irá verificar o tipo de contrato (CLT/PJ), pagar automaticamente o banco de horas a vencer (CLT) e calcular dias extras (PJ) conforme as regras do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Competência</label>
                <Input type="month" defaultValue="2024-07" />
              </div>
              <div className="flex-1 space-y-2">
                 <label className="text-sm font-medium">Empresa</label>
                 <Select defaultValue="all">
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Empresas</SelectItem>
                        <SelectItem value="cnpj1">01.234.567/0001-89 (Matriz)</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                 <label className="text-sm font-medium">Unidade</label>
                 <Select defaultValue="all">
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                        <Factory className="h-4 w-4 text-muted-foreground" />
                        <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Unidades</SelectItem>
                        <SelectItem value="sp">São Paulo - SP</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4">
                 <Button onClick={handleExportCsv} variant="outline" disabled={isProcessing}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Relatório (CSV)
                </Button>
                <Button onClick={handleProcessPayroll} disabled={isProcessing}>
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Calculator className="mr-2 h-4 w-4" />
                    )}
                    {isProcessing ? "Processando..." : "Processar Folha"}
                </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Resultados do Processamento</CardTitle>
                <CardDescription>Visualize o status do processamento para cada colaborador.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Colaborador</TableHead>
                            <TableHead>Contrato</TableHead>
                            <TableHead>Salário Bruto</TableHead>
                            <TableHead>Proventos</TableHead>
                            <TableHead>Descontos</TableHead>
                            <TableHead>Salário Líquido</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payrollRun.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>
                                    <Badge variant={employee.contractType === 'CLT' ? 'default' : 'secondary'}>
                                        {employee.contractType}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono">R$ {employee.grossSalary.toFixed(2)}</TableCell>
                                <TableCell className="font-mono text-green-600">
                                  {employee.payrollData ? `R$ ${employee.payrollData.totalEarnings.toFixed(2)}` : '-'}
                                </TableCell>
                                <TableCell className="font-mono text-red-600">
                                  {employee.payrollData ? `R$ ${employee.payrollData.totalDeductions.toFixed(2)}` : '-'}
                                </TableCell>
                                <TableCell className="font-mono font-bold">
                                  {employee.payrollData ? `R$ ${employee.payrollData.netSalary.toFixed(2)}` : '-'}
                                </TableCell>
                                <TableCell>{getStatusComponent(employee.status)}</TableCell>
                                <TableCell className="text-right">
                                    {employee.status === "Concluído" && (
                                        <Button variant="ghost" size="sm">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Ver Holerite
                                        </Button>
                                    )}
                                    {employee.status === "Erro" && (
                                         <Button variant="outline" size="sm">
                                            Ver Detalhes
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
