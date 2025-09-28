
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
import { KeyRound, Settings, Send, Building, Search, UserPlus, UserMinus, FileText, Loader2, FilePen } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companyData, esocialEventsData as initialEsocialEventsData } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { ESocialEventsTable } from "@/components/esocial/esocial-events-table";
import { useState, useTransition, useMemo } from "react";
import type { EsocialEvent } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { generateESocialEventData } from "@/ai/flows/esocial-event-flow";
import { generateContractChangeData } from "@/ai/flows/contract-change-flow";


export default function ESocialPage() {
    const { toast } = useToast();
    const [isSending, startTransition] = useTransition();
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [events, setEvents] = useState<EsocialEvent[]>(initialEsocialEventsData);
    const [isDataViewerOpen, setIsDataViewerOpen] = useState(false);
    const [generatedData, setGeneratedData] = useState<object | null>(null);
    const [dataViewerTitle, setDataViewerTitle] = useState('');

    const pendingEvents = useMemo(() => {
        const pending = events.filter(e => e.status === 'Pendente');
        return {
            admissions: pending.filter(e => e.type.startsWith('S-2200')).length,
            terminations: pending.filter(e => e.type.startsWith('S-2299')).length,
            payrolls: pending.filter(e => e.type.startsWith('S-1200') || e.type.startsWith('S-1210')).length,
            contractChanges: pending.filter(e => e.type.startsWith('S-2206')).length,
        }
    }, [events]);


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
                description: `Gerando dados para ${selectedEvents.length} eventos. A IA processará eventos de Admissão (S-2200) e Alteração Contratual (S-2206) nesta demo.`,
            });
            
            for (const eventId of selectedEvents) {
                const event = events.find(e => e.id === eventId);
                if (!event) continue;

                try {
                    let data: object | null = null;
                    let title = '';

                    if (event.type.startsWith('S-2200')) {
                        // O 'employeeId' viria do evento, que foi gerado quando o funcionário foi cadastrado.
                        const employeeId = event.employeeId;
                        data = await generateESocialEventData({ employeeId });
                        title = 'Dados Estruturados do Evento eSocial (S-2200 - Admissão)';
                    } else if (event.type.startsWith('S-2206')) {
                         // A simulação de dados para este evento é mais simples no flow
                         data = await generateContractChangeData({
                            employeeId: event.employeeId,
                            changeDate: event.referenceDate,
                            // Em um cenário real, os dados da alteração estariam no `event.details`
                            newSalary: 7000.00, 
                        });
                         title = 'Dados Estruturados do Evento eSocial (S-2206 - Alteração Contratual)';
                    }
                    
                    if(data) {
                        setGeneratedData(data);
                        setDataViewerTitle(title);
                        setIsDataViewerOpen(true);
                        toast({
                            title: `Dados Gerados para ${event.employeeName}!`,
                            description: `Os dados estruturados para o evento ${event.type} foram gerados pela IA.`,
                        });
                        // Em uma aplicação real, aqui você adicionaria o XML gerado a uma fila de envio.
                    }
                } catch (error) {
                     toast({
                        variant: "destructive",
                        title: `Erro ao Gerar Dados para ${event.employeeName}`,
                        description: `Não foi possível gerar os dados do evento ${event.type} com a IA.`,
                    });
                }
            }
        });
    }

    const handleDeleteEvent = (eventId: string) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setSelectedEvents(prev => prev.filter(id => id !== eventId));
        toast({
            title: "Evento Excluído",
            description: "O evento foi removido permanentemente da fila.",
        });
    }

    const handleRejectEvent = (eventId: string) => {
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'Rejeitado' } : e));
        setSelectedEvents(prev => prev.filter(id => id !== eventId));
        toast({
            title: "Evento Rejeitado",
            description: "O evento foi marcado como rejeitado e não será enviado.",
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
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <CardTitle className="text-base font-medium">Alterações (S-2206)</CardTitle>
                        <FilePen className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingEvents.contractChanges}</div>
                        <p className="text-xs text-muted-foreground">Alterações de contrato</p>
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
                <CardDescription>Marque os eventos que você deseja gerar e enviar para o eSocial. A geração de dados com IA é simulada para eventos de admissão (S-2200) e alteração contratual (S-2206).</CardDescription>
            </CardHeader>
            <CardContent>
                <ESocialEventsTable 
                    data={events}
                    selectedEvents={selectedEvents}
                    onSelectedEventsChange={setSelectedEvents}
                    onDelete={handleDeleteEvent}
                    onReject={handleRejectEvent}
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
            <DialogTitle>{dataViewerTitle}</DialogTitle>
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

    