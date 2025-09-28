
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { AttendanceChart } from "@/components/reports/attendance-chart";
import { TimeOffChart } from "@/components/reports/time-off-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Factory } from "lucide-react";
import { ReportsSummary } from "@/components/reports/reports-summary";

export default function ReportsPage() {
  const [company, setCompany] = useState("all");
  const [unit, setUnit] = useState("all");

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Relatórios Gerenciais
          </h1>
          <p className="text-muted-foreground">
            Análises e insights sobre os dados da sua força de trabalho.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por Empresa" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Empresas</SelectItem>
                <SelectItem value="cnpj1">
                  01.234.567/0001-89 (Matriz)
                </SelectItem>
                <SelectItem value="cnpj2">
                  02.345.678/0001-90 (Filial)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Factory className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por Unidade" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Unidades</SelectItem>
                <SelectItem value="sp">São Paulo - SP</SelectItem>
                <SelectItem value="rj">Rio de Janeiro - RJ</SelectItem>
                <SelectItem value="mg">Belo Horizonte - MG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ReportsSummary />

        <div className="grid gap-6 md:grid-cols-2">
          <AttendanceChart />
          <TimeOffChart />
        </div>
      </div>
    </AppLayout>
  );
}
