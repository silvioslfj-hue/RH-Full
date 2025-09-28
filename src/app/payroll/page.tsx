
"use client";

import { useState } from "react";
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
  MoreHorizontal,
  FileText,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PayrollStatus = "Pendente" | "Processando" | "Concluído" | "Erro";

const initialPayrollData = [
  {
    id: "FUNC001",
    name: "Jane Doe",
    role: "Desenvolvedor Front-end",
    grossSalary: 7500.00,
    status: "Pendente" as PayrollStatus,
  },
  {
    id: "FUNC002",
    name: "John Smith",
    role: "Desenvolvedor Back-end",
    grossSalary: 7200.00,
    status: "Pendente" as PayrollStatus,
  },
  {
    id: "FUNC003",
    name: "Alice Johnson",
    role: "Designer de Produto",
    grossSalary: 6800.00,
    status: "Pendente" as PayrollStatus,
  },
];

export default function PayrollPage() {
  const { toast } = useToast();
  const [payrollData, setPayrollData] = useState(initialPayrollData);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessPayroll = () => {
    setIsProcessing(true);
    toast({
      title: "Processamento de Folha Iniciado",
      description: "A folha de pagamento para a competência selecionada está sendo processada.",
    });

    // Simula o processamento individual
    payrollData.forEach((employee, index) => {
      setTimeout(() => {
        setPayrollData(prev => prev.map(e => e.id === employee.id ? { ...e, status: "Processando" } : e));
        
        // Simula a conclusão (ou erro) do processamento
        setTimeout(() => {
             const isSuccess = Math.random() > 0.1; // 90% chance of success
             setPayrollData(prev => prev.map(e => e.id === employee.id ? { ...e, status: isSuccess ? "Concluído" : "Erro" } : e));
             
             // Checa se é o último
             if (index === payrollData.length - 1) {
                setIsProcessing(false);
                toast({
                    title: "Processamento Concluído",
                    description: "A folha de pagamento foi finalizada.",
                });
             }

        }, 1000 + Math.random() * 1000);

      }, index * 500);
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
            Calcule, processe e gerencie a folha de pagamento dos seus colaboradores.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Processar Folha de Pagamento</CardTitle>
            <CardDescription>
              Selecione a competência e os filtros desejados, depois inicie o processamento.
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
            <div className="flex justify-end pt-4">
                <Button onClick={handleProcessPayroll} disabled={isProcessing}>
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Calculator className="mr-2 h-4 w-4" />
                    )}
                    {isProcessing ? "Processando..." : "Processar Folha de Pagamento"}
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
                            <TableHead>Cargo</TableHead>
                            <TableHead>Salário Bruto</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payrollData.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell className="text-muted-foreground">{employee.role}</TableCell>
                                <TableCell className="font-mono">R$ {employee.grossSalary.toFixed(2)}</TableCell>
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
