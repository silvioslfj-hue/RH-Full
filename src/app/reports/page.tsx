
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
import { Building, Factory, Search } from "lucide-react";
import { ReportsSummary } from "@/components/reports/reports-summary";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


export default function ReportsPage() {
  const [company, setCompany] = useState("all");
  const [unit, setUnit] = useState("all");
  const { toast } = useToast();

  const handleApplyFilters = () => {
    toast({
        title: "Filtros Aplicados",
        description: "Os relatórios foram atualizados com os filtros selecionados.",
    });
  }

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

        <Card>
           <CardHeader>
                <CardTitle>Filtros de Análise</CardTitle>
                <CardDescription>
                Selecione o período e os filtros para visualizar os dados consolidados.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Empresa</label>
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
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Unidade</label>
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
                    <div className="flex items-end">
                        <Button className="w-full" onClick={handleApplyFilters}>
                            <Search className="mr-2 h-4 w-4" />
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        

        <ReportsSummary />

        <div className="grid gap-6 md:grid-cols-2">
          <AttendanceChart />
          <TimeOffChart />
        </div>
      </div>
    </AppLayout>
  );
}
