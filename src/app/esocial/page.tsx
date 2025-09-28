
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { KeyRound, Settings, Send, Building, Search, UserPlus, UserMinus, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companyData, esocialEventsData } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { ESocialEventsTable } from "@/components/esocial/esocial-events-table";
import { useState, useTransition } from "react";
import type { EsocialEvent } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { generateESocialEventData } from "@/ai/flows/esocial-event-flow";


const pendingEvents = {
    admissions: 2,
    terminations: 1,
    payrolls: 15,
}

export default function ESocialPage() {
    const { toast } = useToast();
    const [isSending, startTransition] = useTransition();
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [events, setEvents] = useState<EsocialEvent[]>(esocialEventsData);
    const [isDataViewerOpen, setIsDataViewerOpen] = useState(false);
    const [generatedData, setGeneratedData] = useState<object | null>(null);


    const handleSendEvents = () => {
        if(selectedEvents.length === 0) {
            toast({
                variant: "destructive",
                title: "Nenhum Evento Selecionado",
                description: "Selecione ao menos um evento para gerar o envio.",
            });
            return;
        }

        startTransition(async () => {
             toast({
                title: "Geração de Dados Iniciada...",
                description: `Gerando dados para ${selectedEvents.length} eventos.`,
            });
            
            // Exemplo para um evento de admissão (S-2200)
            const admissionEvent = events.find(e => selectedEvents.includes(e.id) && e.type.startsWith('S-2200'));
            if (admissionEvent) {
                try {
                    const data = await generateESocialEventData({ employeeId: 'FUNC001' }); // Usando um ID de exemplo
                    setGeneratedData(data);
                    setIsDataViewerOpen(true);
                     toast({
                        title: "Dados do Evento Gerados!",
                        description: "Os dados estruturados para o evento S-2200 foram gerados pela IA.",
                    });

                } catch (error) {
                     toast({
                        variant: "destructive",
                        title: "Erro ao Gerar Dados",
                        description: "Não foi possível gerar os dados do evento com a IA.",
                    });
                }
            } else {
                 toast({
                    title: "Simulando Envio...",
                    description: "Apenas eventos de admissão (S-2200) geram dados nesta demonstração.",
                });
            }
        });
    }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            eSocial
          </h1>
          <p className="text-muted-foreground">
            Gerencie a geração e o envio de eventos para o eSocial.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Painel de Controle do eSocial</CardTitle>
            <CardDescription>
              Selecione a empresa e a competência para visualizar e enviar os eventos pendentes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Competência</label>
                    <Input type="month" defaultValue="2024-07" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Empresa (CNPJ)</label>
                    <Select>
                        <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Selecione a empresa" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {companyData.map(c => (
                                <SelectItem key={c.id} value={c.cnpj}>
                                    {c.name} - {c.cnpj}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-end">
                    <Button className="w-full">
                        <Search className="mr-2 h-4 w-4" />
                        Consultar Pendências
                    </Button>
                </div>
            </div>
             <Alert>
                <KeyRound className="h-4 w-4" />
                <AlertTitle>Certificado Digital</AlertTitle>
                <AlertDescription>
                    Certifique-se de que a empresa selecionada possui um <strong>Certificado Digital A1</strong> válido e configurado para realizar os envios.
                    <Button variant="link" className="p-0 h-auto ml-1" asChild>
                        <Link href="/settings">Verificar configuração</Link>
                    </Button>
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Eventos Pendentes para Julho/2024</CardTitle>
                <CardDescription>Resumo dos eventos não periódicos e periódicos a serem enviados.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-medium">Admissões (S-2200)</CardTitle>
                        <UserPlus className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingEvents.admissions}</div>
                        <p className="text-xs text-muted-foreground">Novos colaboradores registrados</p>
                    </CardContent>
                </Card>
                 <Card className="bg-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-medium">Desligamentos (S-2299)</CardTitle>
                        <UserMinus className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingEvents.terminations}</div>
                        <p className="text-xs text-muted-foreground">Rescisões de contrato</p>
                    </CardContent>
                </Card>
                 <Card className="bg-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-medium">Folhas (S-1200/S-1210)</CardTitle>
                        <FileText className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingEvents.payrolls}</div>
                        <p className="text-xs text-muted-foreground">Remunerações a serem enviadas</p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

        <Card>
             <CardHeader>
                <CardTitle>Seleção de Eventos para Envio</CardTitle>
                <CardDescription>Marque os eventos que você deseja gerar e enviar para o eSocial. Apenas eventos de admissão (S-2200) gerarão dados nesta demonstração.</CardDescription>
            </CardHeader>
            <CardContent>
                <ESocialEventsTable 
                    data={events}
                    selectedEvents={selectedEvents}
                    onSelectedEventsChange={setSelectedEvents}
                />
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:justify-end">
                 <Button onClick={handleSendEvents} disabled={isSending || selectedEvents.length === 0}>
                    {isSending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    ) : (
                        <Send className="mr-2 h-4 w-4"/>
                    )}
                    {isSending ? `Gerando ${selectedEvents.length} eventos...` : `Gerar e Enviar ${selectedEvents.length} Eventos`}
                </Button>
            </CardFooter>
        </Card>
      </div>

       <Dialog open={isDataViewerOpen} onOpenChange={setIsDataViewerOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Dados Estruturados do Evento eSocial (S-2200)</DialogTitle>
            <DialogDescription>
              Abaixo estão os dados gerados pela IA, prontos para serem convertidos em XML e transmitidos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-muted/50 rounded-md p-4">
            <pre className="text-xs">{JSON.stringify(generatedData, null, 2)}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
