
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Calendar as CalendarIcon, FileText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const fiscalFileTypes = {
    aej: {
        title: "O que é o AEJ?",
        description: "O Arquivo Eletrônico de Jornada (AEJ) contém todas as informações sobre a jornada de trabalho dos funcionários (horários, marcações, etc.) e é utilizado em fiscalizações do Ministério do Trabalho."
    },
    afdt: {
        title: "O que é o AFDT?",
        description: "O Arquivo Fonte de Dados Tratados (AFDT) agrupa todas as marcações de ponto, incluindo as que foram ajustadas ou incluídas manualmente. É um dos arquivos exigidos pela Portaria 671."
    },
    acjef: {
        title: "O que é o ACJEF?",
        description: "O Arquivo de Controle de Jornada para Efeitos Fiscais (ACJEF) detalha as horas trabalhadas, horas extras e faltas dos funcionários, servindo como base para a fiscalização trabalhista."
    }
}

export default function FiscalFilesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [fileType, setFileType] = useState("aej");
  const { toast } = useToast();

  const handleGenerateFile = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        variant: "destructive",
        title: "Período Inválido",
        description:
          "Por favor, selecione uma data de início e fim para gerar o arquivo.",
      });
      return;
    }
    toast({
      title: "Geração de Arquivo Iniciada",
      description: `O arquivo ${fileType.toUpperCase()} está sendo processado e o download começará em breve.`,
    });
  };

  const selectedFileDescription = fiscalFileTypes[fileType as keyof typeof fiscalFileTypes];


  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Arquivos Fiscais
          </h1>
          <p className="text-muted-foreground">
            Emita os arquivos exigidos pela Portaria 671 para fiscalização e conformidade.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Geração de Arquivos para Fiscalização</CardTitle>
            <CardDescription>
              Selecione o tipo de arquivo, o período desejado e clique em "Gerar" para iniciar o download.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de arquivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aej">
                    AEJ - Arquivo Eletrônico de Jornada
                  </SelectItem>
                  <SelectItem value="afdt">
                    AFDT - Arquivo Fonte de Dados Tratados
                  </SelectItem>
                  <SelectItem value="acjef">
                    ACJEF - Arquivo de Controle de Jornada para Efeitos Fiscais
                  </SelectItem>
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
                          {format(dateRange.from, "LLL dd, y", {
                            locale: ptBR,
                          })}{" "}
                          -{" "}
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
            {selectedFileDescription && (
                <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertTitle>{selectedFileDescription.title}</AlertTitle>
                    <AlertDescription>
                       {selectedFileDescription.description}
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
