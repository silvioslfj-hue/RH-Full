"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Download, Search } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";

const allProofs = [
  { id: "CMP001", timestamp: "2024-07-22T09:01:12.000Z", type: "Entrada" },
  { id: "CMP002", timestamp: "2024-07-22T12:32:45.000Z", type: "Saída" },
  { id: "CMP003", timestamp: "2024-07-22T13:33:10.000Z", type: "Entrada" },
  { id: "CMP004", timestamp: "2024-07-22T18:05:00.000Z", type: "Saída" },
  { id: "CMP005", timestamp: "2024-07-23T08:58:30.000Z", type: "Entrada" },
  { id: "CMP006", timestamp: "2024-07-23T12:30:00.000Z", type: "Saída" },
  { id: "CMP007", timestamp: "2024-07-23T13:30:00.000Z", type: "Entrada" },
  { id: "CMP008", timestamp: "2024-07-23T18:00:00.000Z", type: "Saída" },
  { id: "CMP009", timestamp: "2024-08-01T09:00:00.000Z", type: "Entrada" },
  { id: "CMP010", timestamp: "2024-08-01T18:00:00.000Z", type: "Saída" },
];

export default function ProofsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filteredProofs, setFilteredProofs] = useState<typeof allProofs>([]);
  const { toast } = useToast();

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

  const handleDownloadProof = (proofId: string) => {
     toast({
        title: "Download Iniciado",
        description: `O comprovante ${proofId} está sendo gerado.`,
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
                        <Button variant="ghost" size="icon" onClick={() => handleDownloadProof(proof.id)}>
                          <Download className="h-4 w-4" />
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
