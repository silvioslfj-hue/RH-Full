
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { employeeData, disciplinaryData as initialDisciplinaryData, type DisciplinaryAction } from "@/lib/data";

export default function DisciplinaryPage() {
    const { toast } = useToast();
    const [actions, setActions] = useState<DisciplinaryAction[]>(initialDisciplinaryData);

    const [employeeId, setEmployeeId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [type, setType] = useState<DisciplinaryAction['type'] | "">("");
    const [reason, setReason] = useState("");

    const handleIssueAction = () => {
        if(!employeeId || !date || !type || !reason) {
            toast({
                variant: "destructive",
                title: "Campos Obrigatórios",
                description: "Preencha todos os campos para emitir a ação disciplinar."
            });
            return;
        }

        const employee = employeeData.find(e => e.id === employeeId);
        if(!employee) return;

        const newAction: DisciplinaryAction = {
            id: `AD${(actions.length + 1).toString().padStart(3, '0')}`,
            employeeId,
            employeeName: employee.name,
            date,
            type: type as DisciplinaryAction['type'],
            reason,
            issuer: "Jane Doe" // Hardcoded for demo
        };

        setActions(prev => [newAction, ...prev]);
        toast({
            title: "Ação Disciplinar Emitida",
            description: `Uma ${type} foi registrada para ${employee.name}.`
        });

        // Reset form
        setEmployeeId("");
        setDate(new Date().toISOString().split("T")[0]);
        setType("");
        setReason("");
    }
    
    const getTypeVariant = (type: DisciplinaryAction['type']) => {
        switch(type) {
            case 'Advertência Verbal': return 'secondary';
            case 'Advertência Escrita': return 'default';
            case 'Suspensão': return 'destructive';
        }
    }

    return(
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Ações Disciplinares</h1>
                    <p className="text-muted-foreground">Registre advertências, suspensões e outras ações disciplinares.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Emitir Nova Ação Disciplinar</CardTitle>
                        <CardDescription>Selecione o colaborador e preencha os detalhes da ocorrência.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="employee">Colaborador</Label>
                                <Select value={employeeId} onValueChange={setEmployeeId}>
                                    <SelectTrigger id="employee">
                                        <SelectValue placeholder="Selecione um colaborador" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employeeData.filter(e => e.status === 'Ativo').map(e => (
                                            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="action-type">Tipo de Ação</Label>
                                <Select value={type} onValueChange={(v) => setType(v as DisciplinaryAction['type'])}>
                                    <SelectTrigger id="action-type">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Advertência Verbal">Advertência Verbal</SelectItem>
                                        <SelectItem value="Advertência Escrita">Advertência Escrita</SelectItem>
                                        <SelectItem value="Suspensão">Suspensão (dias)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="action-date">Data da Ocorrência</Label>
                                <Input id="action-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="reason">Motivo e Descrição Detalhada</Label>
                            <Textarea id="reason" placeholder="Descreva o ocorrido que motivou esta ação, incluindo datas, fatos e eventuais testemunhas." value={reason} onChange={e => setReason(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button onClick={handleIssueAction}>Registrar Ação</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Histórico de Ações Disciplinares</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Colaborador</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Motivo</TableHead>
                                    <TableHead>Emissor</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {actions.map(action => (
                                    <TableRow key={action.id}>
                                        <TableCell className="font-medium">{action.employeeName}</TableCell>
                                        <TableCell>{new Date(action.date).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell>
                                            <Badge variant={getTypeVariant(action.type)}>{action.type}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">{action.reason}</TableCell>
                                        <TableCell>{action.issuer}</TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        Gerar Documento
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Anular
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
