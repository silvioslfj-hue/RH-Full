"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { AttendanceChart } from "@/components/reports/attendance-chart";
import { TimeOffChart } from "@/components/reports/time-off-chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Factory, Download, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function ReportsPage() {
  const [company, setCompany] = useState("all");
  const [unit, setUnit] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();

  const handleGenerateFile = () => {
    if (!dateRange?.from || !dateRange?.to) {
        toast({
            variant: "destructive",
            title: "Período Inválido",
            description: "Por favor, selecione uma data de início e fim para gerar o arquivo."
        });
        return;
    }
    toast({
        title: "Geração de Arquivo Iniciada",
        description: "O arquivo AEJ (Arquivo Eletrônico de Jornada) está sendo processado e o download começará em breve."
    });
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Análises e insights sobre os dados da sua força de trabalho.</p>
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
                <SelectItem value="cnpj1">01.234.567/0001-89 (Matriz)</SelectItem>
                <SelectItem value="cnpj2">02.345.678/0001-90 (Filial)</SelectItem>
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
        
        <div className="grid gap-6 md:grid-cols-2">
            <AttendanceChart />
            <TimeOffChart />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Geração de Arquivos Fiscais</CardTitle>
            <CardDescription>
              Emita os arquivos exigidos pela Portaria 671 para fiscalização e conformidade.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Select defaultValue="aej">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de arquivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aej">AEJ - Arquivo Eletrônico de Jornada</SelectItem>
                    <SelectItem value="afdt" disabled>AFDT - Arquivo Fonte de Dados Tratados</SelectItem>
                    <SelectItem value="acjef" disabled>ACJEF - Arquivo de Controle de Jornada para Efeitos Fiscais</SelectItem>
                  </SelectContent>
                </Select>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                            {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y", { locale: ptBR })
                        )
                      ) : (
                        <span>Escolha um período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={handleGenerateFile}>
                    <Download className="mr-2 h-4 w-4" />
                    Gerar Arquivo
                </Button>
            </div>
            <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>O que é o AEJ?</AlertTitle>
                <AlertDescription>
                    O Arquivo Eletrônico de Jornada (AEJ) contém todas as informações sobre a jornada de trabalho dos funcionários (horários, marcações, etc.) e é utilizado em fiscalizações do Ministério do Trabalho.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
