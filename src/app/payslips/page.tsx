"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye } from "lucide-react";

const dummyPayslips = [
  { id: "HOL001", month: "Julho/2024", file: "holerite_jul_2024.pdf" },
  { id: "HOL002", month: "Junho/2024", file: "holerite_jun_2024.pdf" },
  { id: "HOL003", month: "Maio/2024", file: "holerite_mai_2024.pdf" },
  { id: "HOL004", month: "Abril/2024", file: "holerite_abr_2024.pdf" },
  { id: "HOL005", month: "Março/2024", file: "holerite_mar_2024.pdf" },
];

export default function PayslipsPage() {
  const [selectedYear, setSelectedYear] = useState("2024");

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
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {dummyPayslips.map((payslip) => (
                <li key={payslip.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Recibo de Pagamento - {payslip.month}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
