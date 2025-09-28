
"use client";

import { useState, useTransition } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Calendar as CalendarIcon, FileText, Loader2, Search } from "lucide-react";
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
import { format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { generateFiscalFile, type FiscalFileInput } from "@/ai/flows/fiscal-file-flow";

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [fileType, setFileType] = useState("aej");
  const { toast } = useToast();
  const [isGenerating, startTransition] = useTransition();

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

    startTransition(async () => {
        toast({
            title: "Geração de Arquivo Iniciada",
            description: `A IA está processando o arquivo ${fileType.toUpperCase()}. O download começará em breve.`,
        });

        try {
            const input: FiscalFileInput = {
                fileType: fileType as FiscalFileInput['fileType'],
                startDate: format(dateRange.from!, "yyyy-MM-dd"),
                endDate: format(dateRange.to!, "yyyy-MM-dd"),
                companyCnpj: "01234567000189", // Exemplo
            };
            
            const result = await generateFiscalFile(input);

            // Create a blob from the file content and trigger download
            const blob = new Blob([result.fileContent], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = result.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
                title: "Arquivo Gerado com Sucesso!",
                description: `O arquivo ${result.fileName} foi baixado.`,
            });

        } catch (error) {
            console.error("Error generating fiscal file:", error);
            toast({
                variant: "destructive",
                title: "Erro na Geração",
                description: "Não foi possível gerar o arquivo fiscal com a IA. Tente novamente.",
            });
        }
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
              Selecione o tipo de arquivo, o período desejado e clique em "Gerar" para a IA criar o arquivo e iniciar o download.
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
                    ACJEF - Arquivo de Controle de Jornada
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
                          {format(dateRange.from, "dd 'de' LLL, y", {
                            locale: ptBR,
                          })}{" "}
                          -{" "}
                          {format(dateRange.to, "dd 'de' LLL, y", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "dd 'de' LLL, y", { locale: ptBR })
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
              <Button onClick={handleGenerateFile} disabled={isGenerating}>
                {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Download className="mr-2 h-4 w-4" />
                )}
                {isGenerating ? "Gerando..." : "Gerar Arquivo"}
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
