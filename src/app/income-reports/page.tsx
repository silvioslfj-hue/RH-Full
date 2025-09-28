"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const dummyReports = [
  { id: "IR001", year: "2023", description: "Informe de Rendimentos - Ano-calendário 2023", file: "informe_2023.pdf" },
  { id: "IR002", year: "2022", description: "Informe de Rendimentos - Ano-calendário 2022", file: "informe_2022.pdf" },
  { id: "IR003", year: "2021", description: "Informe de Rendimentos - Ano-calendário 2021", file: "informe_2021.pdf" },
];

export default function IncomeReportsPage() {
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
                <li key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{report.description}</p>
                    <p className="text-sm text-muted-foreground">Ano-calendário: {report.year}</p>
                  </div>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
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
