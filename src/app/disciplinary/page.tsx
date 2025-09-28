
"use client";

import { useState, useEffect } from "react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { DisciplinaryAction, Employee } from "@/lib/data";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export default function DisciplinaryPage() {
    const { toast } = useToast();
    const [actions, setActions] = useState<DisciplinaryAction[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [employeeId, setEmployeeId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [type, setType] = useState<DisciplinaryAction['type'] | "">("");
    const [reason, setReason] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeesSnapshot = await getDocs(collection(db, "employees"));
                const activeEmployees = employeesSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Employee))
                    .filter(e => e.status === 'Ativo');
                setEmployees(activeEmployees);

                const actionsQuery = query(collection(db, "disciplinary_actions"), orderBy("date", "desc"));
                const actionsSnapshot = await getDocs(actionsQuery);
                const actionsList = actionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DisciplinaryAction));
                setActions(actionsList);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({ variant: "destructive", title: "Erro ao buscar dados do Firestore." });
            }
        };
        fetchData();
    }, [toast]);

    const handleIssueAction = async () => {
        if(!employeeId || !date || !type || !reason) {
            toast({
                variant: "destructive",
                title: "Campos Obrigatórios",
                description: "Preencha todos os campos para emitir a ação disciplinar."
            });
            return;
        }

        const employee = employees.find(e => e.id === employeeId);
        if(!employee) return;

        try {
            const newActionData: Omit<DisciplinaryAction, 'id'> = {
                employeeId,
                employeeName: employee.name,
                date,
                type: type as DisciplinaryAction['type'],
                reason,
                issuer: "Jane Doe" // Hardcoded for demo
            };

            const docRef = await addDoc(collection(db, "disciplinary_actions"), newActionData);
            const newAction = { ...newActionData, id: docRef.id };

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
        } catch (error) {
            console.error("Error issuing disciplinary action:", error);
            toast({ variant: "destructive", title: "Erro ao registrar ação." });
        }
    }

    const handleDeleteAction = async (actionId: string) => {
        try {
            await deleteDoc(doc(db, "disciplinary_actions", actionId));
            setActions(prev => prev.filter(action => action.id !== actionId));
            toast({
                title: "Ação Anulada",
                description: "A ação disciplinar foi removida do histórico."
            });
        } catch (error) {
            console.error("Error deleting action:", error);
            toast({ variant: "destructive", title: "Erro ao anular ação." });
        }
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
                                        {employees.map(e => (
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
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-red-500 focus:text-red-500">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Anular
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta ação não pode ser desfeita. A ação disciplinar será removida permanentemente.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteAction(action.id)} className="bg-destructive hover:bg-destructive/90">
                                                                    Sim, Anular
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
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
