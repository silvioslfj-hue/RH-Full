"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

const dummyProofs = [
  { id: "CMP001", date: "2024-07-22", time: "09:01:12", type: "Entrada" },
  { id: "CMP002", date: "2024-07-22", time: "12:32:45", type: "Saída" },
  { id: "CMP003", date: "2024-07-22", time: "13:33:10", type: "Entrada" },
  { id: "CMP004", date: "2024-07-22", time: "18:05:00", type: "Saída" },
  { id: "CMP005", date: "2024-07-23", time: "08:58:30", type: "Entrada" },
];

export default function ProofsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

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
                    "w-[300px] justify-start text-left font-normal",
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
            <Button>Gerar Comprovantes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registros Encontrados</CardTitle>
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
                {dummyProofs.map((proof) => (
                  <TableRow key={proof.id}>
                    <TableCell>{format(new Date(proof.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-mono">{proof.time}</TableCell>
                    <TableCell>{proof.type}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
