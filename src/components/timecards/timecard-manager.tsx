
"use client";

import { useState, useTransition, useMemo } from "react";
import { reformatTimecard } from "@/ai/flows/timecard-refactoring";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Wand2,
  Calendar as CalendarIcon,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { initialTimecardData, timeSheetData } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { AdjustmentRequestDialog } from "./adjustment-request-dialog";

function AITool() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [timecardInput, setTimecardInput] = useState(initialTimecardData);
  const [reformattedData, setReformattedData] = useState("");
  const [reformattingRequired, setReformattingRequired] = useState<
    boolean | null
  >(null);

  const handleReformat = () => {
    startTransition(async () => {
      try {
        const result = await reformatTimecard({ timecardData: timecardInput });
        setReformattedData(result.reformattedTimecardData);
        setReformattingRequired(result.reformattingRequired);
        toast({
          title: "Processamento Concluído",
          description: result.reformattingRequired
            ? "Os dados do cartão de ponto foram reformatados com sucesso."
            : "Nenhuma reformatação foi necessária para os dados fornecidos.",
        });
      } catch (error) {
        console.error("Erro ao reformatar o cartão de ponto:", error);
        toast({
          variant: "destructive",
          title: "Ocorreu um Erro",
          description:
            "Falha ao reformatar os dados do cartão de ponto. Por favor, tente novamente.",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramenta de Reformatação de Cartão de Ponto</CardTitle>
        <CardDescription>
          Cole os dados brutos do cartão de ponto abaixo e use a ferramenta de IA para reformatá-los em uma estrutura JSON consistente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timecard-input">Dados Brutos do Cartão de Ponto</Label>
            <Textarea
              id="timecard-input"
              value={timecardInput}
              onChange={(e) => setTimecardInput(e.target.value)}
              className="h-80 font-mono text-sm"
              placeholder='Insira ou cole os dados do cartão de ponto aqui... ex: "2024-07-20: IN 09:00, OUT 17:00"'
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reformatted-output">Saída JSON Reformatada</Label>
            <div className="relative">
              <Textarea
                id="reformatted-output"
                value={
                  reformattedData
                    ? JSON.stringify(JSON.parse(reformattedData), null, 2)
                    : ""
                }
                readOnly
                className="h-80 font-mono text-sm bg-muted/50"
                placeholder="Os dados reformatados aparecerão aqui..."
              />
              {reformattingRequired !== null && (
                <Badge
                  variant={reformattingRequired ? "destructive" : "secondary"}
                  className="absolute top-3 right-3"
                >
                  {reformattingRequired ? "Reformatação Aplicada" : "Sem Alterações"}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleReformat} disabled={isPending || !timecardInput}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Processando..." : "Reformatar com IA"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InconsistentEntries({ entries, onAdjust }: { entries: any[], onAdjust: (entry: any) => void }) {
    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                        <CardTitle>Marcações com Inconsistência</CardTitle>
                        <CardDescription className="text-destructive/90">
                           As seguintes marcações precisam de sua atenção.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Dia</TableHead>
                            <TableHead>Marcações</TableHead>
                            <TableHead>Ocorrência</TableHead>
                            <TableHead className="text-right">Ação</TableHead>
                        </TableRow>
                    </TableHeader>
                     <TableBody>
                        {entries.map((row, index) => (
                            <TableRow key={index} className="bg-destructive/5 hover:bg-destructive/10">
                                <TableCell>
                                    <div className="font-medium">{row.day}</div>
                                    <div className="text-sm text-muted-foreground">{row.date}</div>
                                </TableCell>
                                <TableCell className="font-mono">{row.entries}</TableCell>
                                <TableCell>
                                    <Badge variant="destructive">{row.issue}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <Button size="sm" variant="outline" onClick={() => onAdjust(row)}>
                                        Ajustar
                                     </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function TimeSheetManager() {
    const { toast } = useToast();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2024, 6, 1),
        to: new Date(2024, 6, 31)
    });
    const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);

    const { inconsistentEntries, consistentEntries } = useMemo(() => {
        return timeSheetData.reduce((acc, entry) => {
            if (entry.status === 'warning') {
                acc.inconsistentEntries.push(entry);
            } else {
                acc.consistentEntries.push(entry);
            }
            return acc;
        }, { inconsistentEntries: [] as any[], consistentEntries: [] as any[] });
    }, []);


  const handleApprove = () => {
    toast({
      title: "Espelho de Ponto Aprovado",
      description: "O espelho de ponto do funcionário foi marcado como aprovado.",
    });
  };

  const handleAdjustmentRequest = (reason: string) => {
    toast({
      title: "Solicitação de Ajuste Enviada",
      description: "O funcionário foi notificado para realizar o ajuste no ponto.",
    });
    setIsAdjustmentDialogOpen(false);
  };

  const openAdjustmentForEntry = (entry: any) => {
    // This could pre-fill the adjustment dialog in a real app
    setIsAdjustmentDialogOpen(true);
  }

  return (
    <>
     <Card>
      <CardHeader>
        <CardTitle>Espelho de Ponto</CardTitle>
        <CardDescription>
          Selecione o funcionário e o período para visualizar e gerenciar os registros de ponto.
        </CardDescription>
        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
            <Select>
                <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="jane-doe">Jane Doe</SelectItem>
                    <SelectItem value="john-smith">John Smith</SelectItem>
                    <SelectItem value="alice-johnson">Alice Johnson</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full md:w-[300px] justify-start text-left font-normal",
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
            <Button className="w-full md:w-auto">
                <Search className="mr-2 h-4 w-4"/>
                Buscar
            </Button>
            <Button variant="outline" className="w-full md:w-auto ml-auto">
                <Download className="mr-2 h-4 w-4"/>
                Exportar PDF
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {inconsistentEntries.length > 0 && (
            <InconsistentEntries entries={inconsistentEntries} onAdjust={openAdjustmentForEntry} />
        )}
        
        <div>
            <h3 className="text-lg font-medium mb-2">Registros Válidos</h3>
            <Table className="border rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Dia</TableHead>
                        <TableHead>Marcações</TableHead>
                        <TableHead>Horas Trab.</TableHead>
                        <TableHead>Saldo Dia</TableHead>
                        <TableHead>Ocorrência</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {consistentEntries.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="font-medium">{row.day}</div>
                                <div className="text-sm text-muted-foreground">{row.date}</div>
                            </TableCell>
                            <TableCell className="font-mono">{row.entries}</TableCell>
                            <TableCell className="font-mono">{row.worked}</TableCell>
                            <TableCell className={`font-mono font-semibold ${row.balance.startsWith('+') ? 'text-green-600' : row.balance.startsWith('-') ? 'text-red-600' : ''}`}>
                                {row.balance}
                            </TableCell>
                            <TableCell>
                                {row.issue && <Badge variant={row.status === 'warning' ? 'destructive' : 'secondary'}>{row.issue}</Badge>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
       <div className="flex items-center justify-end gap-4 p-6 border-t">
          <Button variant="outline" onClick={() => setIsAdjustmentDialogOpen(true)}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Solicitar Ajuste Geral
          </Button>
          <Button onClick={handleApprove}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Aprovar Espelho de Ponto
          </Button>
        </div>
    </Card>
     <AdjustmentRequestDialog
        isOpen={isAdjustmentDialogOpen}
        onClose={() => setIsAdjustmentDialogOpen(false)}
        onConfirm={handleAdjustmentRequest}
      />
    </>
  )
}

export function TimecardManager() {
  return (
    <Tabs defaultValue="sheet">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sheet">Espelho de Ponto</TabsTrigger>
        <TabsTrigger value="ai-tool">Ferramenta de IA</TabsTrigger>
      </TabsList>
      <TabsContent value="sheet" className="pt-6">
        <TimeSheetManager />
      </TabsContent>
      <TabsContent value="ai-tool" className="pt-6">
        <AITool />
      </TabsContent>
    </Tabs>
  );
}
