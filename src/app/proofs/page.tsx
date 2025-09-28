"use client";

import { useState, useTransition } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Download, Search, Loader2 } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { generateProofContent, type ProofGenerationInput } from "@/ai/flows/proof-generation-flow";

const allProofs = [
  { id: "CMP001", timestamp: "2024-07-22T09:01:12.000Z", type: "Entrada", employeeId: "FUNC001" },
  { id: "CMP002", timestamp: "2024-07-22T12:32:45.000Z", type: "Saída", employeeId: "FUNC001" },
  { id: "CMP003", timestamp: "2024-07-22T13:33:10.000Z", type: "Entrada", employeeId: "FUNC001" },
  { id: "CMP004", timestamp: "2024-07-22T18:05:00.000Z", type: "Saída", employeeId: "FUNC001" },
  { id: "CMP005", timestamp: "2024-07-23T08:58:30.000Z", type: "Entrada", employeeId: "FUNC002" },
  { id: "CMP006", timestamp: "2024-07-23T12:30:00.000Z", type: "Saída", employeeId: "FUNC002" },
  { id: "CMP007", timestamp: "2024-07-23T13:30:00.000Z", type: "Entrada", employeeId: "FUNC002" },
  { id: "CMP008", timestamp: "2024-07-23T18:00:00.000Z", type: "Saída", employeeId: "FUNC002" },
  { id: "CMP009", timestamp: "2024-08-01T09:00:00.000Z", type: "Entrada", employeeId: "FUNC001" },
  { id: "CMP010", timestamp: "2024-08-01T18:00:00.000Z", type: "Saída", employeeId: "FUNC001" },
];

export default function ProofsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filteredProofs, setFilteredProofs] = useState<typeof allProofs>([]);
  const { toast } = useToast();
  const [isGenerating, startTransition] = useTransition();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleSearch = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        variant: "destructive",
        title: "Período Inválido",
        description: "Por favor, selecione uma data de início e fim.",
      });
      return;
    }

    const proofsInDateRange = allProofs.filter(proof => {
      const proofDate = new Date(proof.timestamp);
      return isWithinInterval(proofDate, { start: dateRange.from!, end: dateRange.to! });
    });

    setFilteredProofs(proofsInDateRange);

    if(proofsInDateRange.length === 0){
       toast({
        title: "Nenhum Registro Encontrado",
        description: "Não há comprovantes de ponto para o período selecionado.",
      });
    }
  }

  const handleDownloadProof = (proof: (typeof allProofs)[0]) => {
     startTransition(async () => {
        setGeneratingId(proof.id);
        toast({
          title: "Gerando Comprovante...",
          description: `A IA está gerando o comprovante ${proof.id}.`,
        });

        try {
            const input: ProofGenerationInput = {
                proofId: proof.id,
                employeeId: proof.employeeId,
                timestamp: proof.timestamp,
            };

            const result = await generateProofContent(input);

            const blob = new Blob([result.proofContent], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = result.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
                title: "Comprovante Gerado!",
                description: `O arquivo ${result.fileName} foi baixado.`,
            });
        } catch (error) {
            console.error("Error generating proof:", error);
            toast({
                variant: "destructive",
                title: "Erro na Geração",
                description: "Não foi possível gerar o comprovante com a IA.",
            });
        } finally {
            setGeneratingId(null);
        }
     });
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Comprovantes de Ponto</h1>
          <p className="text-muted-foreground">Emita seus comprovantes de registro de ponto conforme a Portaria 671.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerar Relatório</CardTitle>
            <CardDescription>Selecione o período para o qual deseja gerar os comprovantes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[300px] justify-start text-left font-normal",
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
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </CardContent>
        </Card>

        {filteredProofs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Registros Encontrados</CardTitle>
               <CardDescription>
                Encontrados {filteredProofs.length} registros para o período selecionado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProofs.map((proof) => (
                    <TableRow key={proof.id}>
                      <TableCell>{format(new Date(proof.timestamp), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="font-mono">{format(new Date(proof.timestamp), "HH:mm:ss")}</TableCell>
                      <TableCell>{proof.type}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDownloadProof(proof)} disabled={isGenerating}>
                          {isGenerating && generatingId === proof.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
