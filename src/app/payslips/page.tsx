
"use client";

import { useState, useTransition, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePayslipContent } from "@/ai/flows/payslip-generation-flow";
import { PayslipViewerDialog } from "@/components/payroll/payslip-viewer-dialog";
import type { PayrollHistory as PayslipType, PayslipGenerationInput } from "@/lib/data";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, query, where } from "firebase/firestore";


export default function PayslipsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { toast } = useToast();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [payslipContent, setPayslipContent] = useState("");
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipType | null>(null);
  const [isGenerating, startTransition] = useTransition();
  const [payslips, setPayslips] = useState<PayslipType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded employeeId for demo purposes. In a real app, this would come from an auth context.
  const employeeId = 'FUNC001';

  useEffect(() => {
    const fetchPayslips = async () => {
      if (!employeeId) return;

      setIsLoading(true);
      try {
        const q = query(
          collection(db, "payrollHistory"), 
          where("employeeId", "==", employeeId)
        );
        const querySnapshot = await getDocs(q);
        const fetchedPayslips = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PayslipType));
        setPayslips(fetchedPayslips);
      } catch (error) {
        console.error("Error fetching payslips:", error);
        toast({ variant: "destructive", title: "Erro ao buscar holerites." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayslips();
  }, [employeeId, toast]);


  const handleGenerateContent = async (item: PayslipType): Promise<string | null> => {
    try {
        if (!item.payrollData) {
            throw new Error("Dados detalhados da folha não encontrados para este holerite.");
        }
        
        const input: PayslipGenerationInput = {
            company: { name: "RH-Full Soluções em TI", cnpj: "01.234.567/0001-89" },
            employee: { name: item.employeeName, role: "Desenvolvedor" }, // Role seria dinâmico
            competence: item.competence,
            payrollData: item.payrollData
        }

        const result = await generatePayslipContent(input);
        return result.payslipContent;
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Erro ao Gerar Holerite",
            description: (error as Error).message || "Não foi possível gerar o documento. Tente novamente."
        });
        return null;
    }
  }

  const handleViewPayslip = (item: PayslipType) => {
    startTransition(async () => {
        setSelectedPayslip(item);
        toast({
            title: "Gerando seu Holerite...",
            description: `Aguarde enquanto a IA prepara seu holerite de ${item.competence}.`
        });
        const content = await handleGenerateContent(item);
        if (content) {
            setPayslipContent(content);
            setIsViewerOpen(true);
        }
        setSelectedPayslip(null); // Reset after generation
    });
  };

  const handleDownloadPayslip = (item: PayslipType) => {
     startTransition(async () => {
        setSelectedPayslip(item);
        toast({
            title: "Preparando seu Download...",
            description: `Aguarde enquanto a IA gera o arquivo de seu holerite de ${item.competence}.`
        });
        const content = await handleGenerateContent(item);
        if (content) {
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const fileName = `holerite_${item.employeeName.replace(/\s/g, '_')}_${item.competence.replace('/', '-')}.txt`;
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast({
                title: "Download Iniciado",
                description: `O arquivo ${fileName} foi salvo.`
            });
        }
        setSelectedPayslip(null); // Reset after generation
    });
  }

  const filteredPayslips = payslips.filter(p => p.competence.endsWith(selectedYear));
  const availableYears = [...new Set(payslips.map(p => p.competence.split('/')[1]))].sort((a,b) => parseInt(b) - parseInt(a));

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Meus Holerites</h1>
          <p className="text-muted-foreground">Acesse e baixe seus recibos de pagamento.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Histórico de Holerites</CardTitle>
                <CardDescription>Selecione o ano para visualizar os holerites correspondentes.</CardDescription>
              </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                   {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPayslips.length > 0 ? (
               <ul className="space-y-3">
                {filteredPayslips.map((payslip) => {
                  const isProcessing = isGenerating && selectedPayslip?.id === payslip.id;
                  return (
                    <li key={payslip.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">Recibo de Pagamento - {payslip.competence}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewPayslip(payslip)} disabled={isProcessing}>
                           {isProcessing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Eye className="mr-2 h-4 w-4" />
                            )}
                          {isProcessing ? "Gerando..." : "Visualizar"}
                        </Button>
                         <Button variant="ghost" size="icon" title="Baixar Holerite" onClick={() => handleDownloadPayslip(payslip)} disabled={isProcessing}>
                            {isProcessing ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Download className="h-5 w-5" />
                            )}
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <p>Nenhum holerite encontrado para o ano de {selectedYear}.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedPayslip && payslipContent && (
        <PayslipViewerDialog
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            content={payslipContent}
            employeeName={selectedPayslip.employeeName}
            competence={selectedPayslip.competence}
        />
      )}
    </AppLayout>
  );
}
