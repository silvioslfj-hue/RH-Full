
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
  Search,
  Building,
  Factory,
  User,
  FileText,
  Download,
  Loader2
} from "lucide-react";
import { employeeData, payrollHistoryData as initialHistory, type PayrollHistory as PayrollHistoryType } from "@/lib/data";
import { PayslipViewerDialog } from "@/components/payroll/payslip-viewer-dialog";
import { generatePayslipContent, type PayslipGenerationInput } from "@/ai/flows/payslip-generation-flow";
import { useToast } from "@/hooks/use-toast";


export default function PayrollHistoryPage() {
  const { toast } = useToast();
  const [history, setHistory] = useState<PayrollHistoryType[]>(initialHistory);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [payslipContent, setPayslipContent] = useState("");
  const [selectedPayslipData, setSelectedPayslipData] = useState<PayrollHistoryType | null>(null);
  const [isGenerating, startTransition] = useTransition();

  const handleViewPayslip = (item: PayrollHistoryType) => {
    startTransition(async () => {
        setSelectedPayslipData(item);
        toast({
            title: "Gerando Holerite...",
            description: `Aguarde enquanto a IA prepara o holerite de ${item.employeeName}.`
        });
        
        try {
            // Em um app real, os dados detalhados do payroll viriam do `item`
            const detailedPayrollData = {
                 grossSalary: item.grossSalary,
                 earnings: [
                    { name: "Horas Extras", value: item.grossSalary * 0.1 }, // Simulação
                 ],
                 deductions: [
                    { name: "INSS", value: item.grossSalary * 0.11 }, // Simulação
                    { name: "IRRF", value: item.grossSalary * 0.07 }, // Simulação
                 ],
                 totalEarnings: item.grossSalary + (item.grossSalary * 0.1),
                 totalDeductions: (item.grossSalary * 0.11) + (item.grossSalary * 0.07),
                 netSalary: item.netSalary
            };

            const input: PayslipGenerationInput = {
                company: { name: "RH-Full Soluções em TI", cnpj: "01.234.567/0001-89" },
                employee: { name: item.employeeName, role: "Desenvolvedor" },
                competence: item.competence,
                payrollData: detailedPayrollData
            }

            const result = await generatePayslipContent(input);
            setPayslipContent(result.payslipContent);
            setIsViewerOpen(true);

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao Gerar Holerite",
                description: "Não foi possível gerar o documento. Tente novamente."
            });
        }
    });
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Histórico de Folhas de Pagamento
          </h1>
          <p className="text-muted-foreground">
            Consulte, audite e exporte os registros de folhas de pagamento processadas.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros de Consulta</CardTitle>
            <CardDescription>
              Utilize os filtros abaixo para encontrar as folhas de pagamento desejadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Competência</label>
                <Input type="month" />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Empresa</label>
                 <Select>
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Todas" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Empresas</SelectItem>
                        <SelectItem value="cnpj1">01.234.567/0001-89 (Matriz)</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Unidade</label>
                 <Select>
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Factory className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Todas" />
                        </div>
                    </Trigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Unidades</SelectItem>
                        <SelectItem value="sp">São Paulo - SP</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Colaborador</label>
                 <Select>
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Todos" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Colaboradores</SelectItem>
                        {employeeData.map(e => (
                            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
                <Button>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Resultados da Consulta</CardTitle>
                <CardDescription>
                  Exibindo {history.length} registros encontrados.
                </CardDescription>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Competência</TableHead>
                            <TableHead>Colaborador</TableHead>
                            <TableHead>Salário Bruto</TableHead>
                            <TableHead>Salário Líquido</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.competence}</TableCell>
                                <TableCell>{item.employeeName}</TableCell>
                                <TableCell className="font-mono">R$ {item.grossSalary.toFixed(2)}</TableCell>
                                <TableCell className="font-mono font-bold">R$ {item.netSalary.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-600 hover:bg-green-700">{item.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleViewPayslip(item)} disabled={isGenerating && selectedPayslipData?.id === item.id}>
                                        {isGenerating && selectedPayslipData?.id === item.id ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <FileText className="mr-2 h-4 w-4" />
                                        )}
                                        Ver Holerite
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </div>
      {selectedPayslipData && (
        <PayslipViewerDialog
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            content={payslipContent}
            employeeName={selectedPayslipData.employeeName}
            competence={selectedPayslipData.competence}
        />
      )}
    </AppLayout>
  );
}
