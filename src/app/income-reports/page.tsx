"use client";

import { useState, useTransition } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateIncomeReport } from "@/ai/flows/income-report-flow";
import type { IncomeReportInput } from "@/lib/data";

const dummyReports = [
  { id: "IR001", year: 2023, description: "Informe de Rendimentos - Ano-calendário 2023" },
  { id: "IR002", year: 2022, description: "Informe de Rendimentos - Ano-calendário 2022" },
  { id: "IR003", year: 2021, description: "Informe de Rendimentos - Ano-calendário 2021" },
];

export default function IncomeReportsPage() {
  const { toast } = useToast();
  const [isGenerating, startTransition] = useTransition();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleDownload = (report: (typeof dummyReports)[0]) => {
    startTransition(async () => {
      setGeneratingId(report.id);
      toast({
        title: "Gerando Informe de Rendimentos...",
        description: `Aguarde enquanto a IA prepara seu informe de ${report.year}.`
      });

      try {
        const input: IncomeReportInput = {
          employeeId: 'FUNC001', // Hardcoded for demo, would come from logged in user context
          year: report.year,
        };

        const result = await generateIncomeReport(input);

        const blob = new Blob([result.reportContent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
            title: "Download Iniciado!",
            description: `O arquivo ${result.fileName} foi salvo.`,
        });

      } catch (error) {
        console.error("Error generating income report:", error);
        toast({
            variant: "destructive",
            title: "Erro na Geração",
            description: "Não foi possível gerar o informe de rendimentos com a IA.",
        });
      } finally {
        setGeneratingId(null);
      }
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Informes de Rendimento</h1>
          <p className="text-muted-foreground">Baixe seus informes para a declaração do Imposto de Renda.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seus Documentos</CardTitle>
            <CardDescription>Aqui estão os seus informes de rendimentos dos últimos anos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {dummyReports.map((report) => (
                <li key={report.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold">{report.description}</p>
                    <p className="text-sm text-muted-foreground">Ano-calendário: {report.year}</p>
                  </div>
                  <Button onClick={() => handleDownload(report)} disabled={isGenerating}>
                    {isGenerating && generatingId === report.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {isGenerating && generatingId === report.id ? "Gerando..." : "Baixar Informe"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
