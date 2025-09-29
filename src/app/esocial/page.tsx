
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
import { KeyRound, Settings, Send, Building, Search, UserPlus, UserMinus, FileText, Loader2, FilePen, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Company, EsocialEvent } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { ESocialEventsTable } from "@/components/esocial/esocial-events-table";
import { useState, useTransition, useMemo, useEffect } from "react";
import { generateESocialEventData } from "@/ai/flows/esocial-event-flow";
import { generateContractChangeData } from "@/ai/flows/contract-change-flow";
import { db } from "@/lib/firebaseClient";
import { getFunctions, httpsCallable } from "firebase/functions";
import { collection, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";


export default function ESocialPage() {
    const { toast } = useToast();
    const [isGenerating, startTransition] = useTransition();
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [events, setEvents] = useState<EsocialEvent[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    
    const [competenceFilter, setCompetenceFilter] = useState("2024-07");
    const [companyFilter, setCompanyFilter] = useState("all");

    useEffect(() => {
        const fetchCompanies = async () => {
             try {
                const companiesSnapshot = await getDocs(collection(db, "companies"));
                setCompanies(companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company)));
            } catch (error) {
                console.error("Error fetching companies:", error);
                toast({ variant: "destructive", title: "Erro ao buscar empresas." });
            }
        };
        fetchCompanies();

        // Real-time listener for events
        const unsubscribe = onSnapshot(collection(db, "esocialEvents"), (querySnapshot) => {
            const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EsocialEvent));
            setEvents(eventsData);
        }, (error) => {
            console.error("Error fetching eSocial events in real-time:", error);
            toast({ variant: "destructive", title: "Erro ao buscar eventos do eSocial." });
        });
        
        return () => unsubscribe(); // Cleanup listener on component unmount
    }, [toast]);


    const filteredEvents = useMemo(() => {
        return events.filter(e => {
            const eventDate = new Date(e.referenceDate);
            const [year, month] = competenceFilter.split('-');
            const competenceMatch = eventDate.getFullYear() === parseInt(year) && (eventDate.getMonth() + 1) === parseInt(month);
            // This filtering logic might need to be improved based on how company is linked to an employee
            const companyMatch = companyFilter === 'all' // || e.companyId === companyFilter;
            return competenceMatch && companyMatch;
        });
    }, [events, competenceFilter, companyFilter]);


    const pendingEventsSummary = useMemo(() => {
        const pending = filteredEvents.filter(e => e.status === 'Pendente');
        return {
            admissions: pending.filter(e => e.type.startsWith('S-2200')).length,
            terminations: pending.filter(e => e.type.startsWith('S-2299')).length,
            payrolls: pending.filter(e => e.type.startsWith('S-1200') || e.type.startsWith('S-1210')).length,
            contractChanges: pending.filter(e => e.type.startsWith('S-2206')).length,
        }
    }, [filteredEvents]);


    const handleGenerateXml = () => {
        if(selectedEvents.length === 0) {
            toast({
                variant: "destructive",
                title: "Nenhum Evento Selecionado",
                description: "Selecione ao menos um evento para gerar o XML.",
            });
            return;
        }

        const functions = getFunctions();
        const transmitirEventoESocial = httpsCallable(functions, 'transmitirEventoESocial');

        startTransition(async () => {
             toast({
                title: "Geração de XML Iniciada...",
                description: `A IA processará os eventos e em seguida o XML será salvo.`,
            });
            
            for (const eventId of selectedEvents) {
                const event = events.find(e => e.id === eventId);
                if (!event) continue;

                let data: object | null = null;
                
                try {
                    // Step 1: Generate JSON data with AI flows
                    if (event.type.startsWith('S-2200')) {
                        data = await generateESocialEventData({ employeeId: event.employeeId });
                    } else if (event.type.startsWith('S-2206')) {
                         data = await generateContractChangeData({
                            employeeId: event.employeeId,
                            changeDate: event.referenceDate,
                            changeDetails: event.details,
                        });
                    }
                    // TODO: Add flows for other event types (S-2299, S-1200, etc.)
                    
                    if(data) {
                        // Step 2: Call the backend function to generate and save XML
                        await transmitirEventoESocial({ eventId: eventId, jsonData: data });

                        toast({
                            title: `XML Gerado para ${event.type}!`,
                            description: `O XML para ${event.employeeName} está pronto para download.`,
                        });
                    } else {
                        throw new Error(`Fluxo de IA para o tipo de evento ${event.type} não implementado.`);
                    }
                    setSelectedEvents(prev => prev.filter(id => id !== eventId));
                    break; // Process one at a time for this demo
                } catch (error: any) {
                     toast({
                        variant: "destructive",
                        title: `Erro ao Processar Evento para ${event.employeeName}`,
                        description: error.message || "A IA ou o backend falhou ao processar este evento.",
                    });
                     await updateDoc(doc(db, "esocialEvents", eventId), { status: 'Erro', errorMessage: error.message });
                }
            }
        });
    }

    const handleDeleteEvent = async (eventId: string) => {
        try {
            await deleteDoc(doc(db, "esocialEvents", eventId));
            setSelectedEvents(prev => prev.filter(id => id !== eventId));
            toast({
                title: "Evento Excluído",
                description: "O evento foi removido permanentemente da fila.",
            });
        } catch (error) {
            toast({ variant: "destructive", title: "Erro ao excluir evento." });
        }
    }

    const handleRejectEvent = async (eventId: string) => {
        try {
            await updateDoc(doc(db, "esocialEvents", eventId), { status: 'Rejeitado' });
            setSelectedEvents(prev => prev.filter(id => id !== eventId));
            toast({
                title: "Evento Rejeitado",
                description: "O evento foi marcado como rejeitado e não será enviado.",
            });
        } catch (error) {
             toast({ variant: "destructive", title: "Erro ao rejeitar evento." });
        }
    }
    
    const handleDownloadXml = (event: EsocialEvent) => {
        if (!event.xmlContent) {
            toast({ variant: "destructive", title: "Conteúdo XML não encontrado." });
            return;
        }

        const blob = new Blob([event.xmlContent], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `${event.type.replace(/\s/g, '_')}_${event.employeeName.replace(/\s/g, '_')}.xml`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }


    const handleResetFilters = () => {
        setCompetenceFilter("2024-07");
        setCompanyFilter("all");
         toast({
            title: "Filtros Redefinidos",
            description: "Exibindo todos os eventos para a competência padrão.",
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
            Gerencie a geração de eventos para upload manual no portal do eSocial.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Painel de Controle do eSocial</CardTitle>
            <CardDescription>
              Selecione a empresa e a competência para visualizar e gerar os arquivos XML dos eventos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Competência</label>
                    <Input type="month" value={competenceFilter} onChange={e => setCompetenceFilter(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Empresa (CNPJ)</label>
                    <Select value={companyFilter} onValueChange={setCompanyFilter}>
                        <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Selecione a empresa" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">
                                Todas as Empresas
                            </SelectItem>
                            {companies.map(c => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name} - {c.cnpj}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-end">
                    <Button variant="outline" className="w-full" onClick={handleResetFilters}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Limpar Filtros
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-muted/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Admissões</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingEventsSummary.admissions}</div>
                </CardContent>
            </Card>
            <Card className="bg-muted/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Alterações</CardTitle>
                    <FilePen className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingEventsSummary.contractChanges}</div>
                </CardContent>
            </Card>
             <Card className="bg-muted/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Desligamentos</CardTitle>
                    <UserMinus className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingEventsSummary.terminations}</div>
                </CardContent>
            </Card>
             <Card className="bg-muted/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Folhas</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingEventsSummary.payrolls}</div>
                </CardContent>
            </Card>
            <Card className="bg-muted/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Eventos de Ponto</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                </CardContent>
            </Card>
        </div>

        <Card>
             <CardHeader>
                <CardTitle>Fila de Eventos</CardTitle>
                <CardDescription>Marque os eventos que você deseja gerar. A IA criará o arquivo XML, que ficará disponível para download para o envio manual no portal do eSocial.</CardDescription>
            </CardHeader>
            <CardContent>
                <ESocialEventsTable 
                    data={filteredEvents}
                    selectedEvents={selectedEvents}
                    onSelectedEventsChange={setSelectedEvents}
                    onReject={handleRejectEvent}
                    onDelete={handleDeleteEvent}
                    onDownload={handleDownloadXml}
                />
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:justify-end">
                 <Button onClick={handleGenerateXml} disabled={isGenerating || selectedEvents.length === 0}>
                    {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    ) : (
                        <Send className="mr-2 h-4 w-4"/>
                    )}
                    {isGenerating ? `Gerando ${selectedEvents.length} XML...` : `Gerar XML para ${selectedEvents.length} Eventos`}
                </Button>
            </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
