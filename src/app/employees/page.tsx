
"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, FileDown, Search, Building, MapPin } from "lucide-react";
import { EmployeesTable } from "@/components/employees/employees-table";
import { EmployeeDialog } from "@/components/employees/employee-dialog";
import type { Employee, EsocialEvent, Unit, Role, Company } from "@/lib/data";
import { ContractChangeDialog } from "@/components/employees/contract-change-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TerminationDialog } from "@/components/employees/termination-dialog";
import { generateTerminationData } from "@/ai/flows/termination-flow";
import { VacationDialog } from "@/components/employees/vacation-dialog";
import { generateVacationData } from "@/ai/flows/vacation-flow";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";

export default function EmployeesPage() {
    const { toast } = useToast();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
    const [isContractChangeDialogOpen, setIsContractChangeDialogOpen] = useState(false);
    const [isTerminationDialogOpen, setIsTerminationDialogOpen] = useState(false);
    const [isVacationDialogOpen, setIsVacationDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [events, setEvents] = useState<EsocialEvent[]>([]);
    const [isProcessing, startTransition] = useTransition();

    const [nameFilter, setNameFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('all');
    const [unitFilter, setUnitFilter] = useState('all');

    // States for settings data
    const [companies, setCompanies] = useState<Company[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [workShifts, setWorkShifts] = useState<any[]>([]); // Assuming workShifts are also in settings

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    employeesSnapshot, 
                    companiesSnapshot, 
                    unitsSnapshot, 
                    rolesSnapshot, 
                    workShiftsSnapshot,
                    esocialEventsSnapshot
                ] = await Promise.all([
                    getDocs(collection(db, "employees")),
                    getDocs(collection(db, "companies")),
                    getDocs(collection(db, "units")),
                    getDocs(collection(db, "roles")),
                    getDocs(collection(db, "workShifts")),
                    getDocs(collection(db, "esocialEvents"))
                ]);

                setEmployees(employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
                setCompanies(companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company)));
                setUnits(unitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit)));
                setRoles(rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role)));
                setWorkShifts(workShiftsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setEvents(esocialEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EsocialEvent)));

            } catch (error) {
                console.error("Error fetching data:", error);
                toast({ variant: "destructive", title: "Erro ao carregar dados do Firestore." });
            }
        };
        fetchData();
    }, [toast]);


    const filteredEmployees = useMemo(() => {
        return employees.filter(employee => {
            const nameMatch = employee.name.toLowerCase().includes(nameFilter.toLowerCase());
            const companyMatch = companyFilter === 'all' || employee.company === companyFilter;
            const unitMatch = unitFilter === 'all' || employee.unit === unitFilter;
            return nameMatch && companyMatch && unitMatch;
        });
    }, [employees, nameFilter, companyFilter, unitFilter]);

    const handleOpenEmployeeDialog = (employee: Employee | null = null) => {
        setEditingEmployee(employee);
        setIsEmployeeDialogOpen(true);
    };

    const handleCloseEmployeeDialog = () => {
        setEditingEmployee(null);
        setIsEmployeeDialogOpen(false);
    };

    const handleSaveEmployee = async (employeeData: any) => {
        try {
            if (editingEmployee) {
                const docRef = doc(db, "employees", editingEmployee.id);
                await setDoc(docRef, employeeData, { merge: true });
                setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...employeeData } : e));
                toast({ title: "Colaborador atualizado com sucesso!" });
            } else {
                const docRef = await addDoc(collection(db, "employees"), employeeData);
                const newEmployee = { ...employeeData, id: docRef.id };
                setEmployees([...employees, newEmployee]);
                toast({ title: "Colaborador adicionado com sucesso!" });
            }
            handleCloseEmployeeDialog();
        } catch (error) {
            console.error("Error saving employee:", error);
            toast({ variant: "destructive", title: "Erro ao salvar colaborador." });
        }
    };

    const handleOpenDeactivateDialog = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsTerminationDialogOpen(true);
    };

    const handleOpenContractChangeDialog = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsContractChangeDialogOpen(true);
    };
    
    const handleOpenVacationDialog = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsVacationDialogOpen(true);
    };

    const handleContractChange = async (changeData: { newSalary?: number; newRole?: string }) => {
        if (!editingEmployee) return;

        try {
            const updatedEmployee = { 
                ...editingEmployee, 
                role: changeData.newRole || editingEmployee.role,
            };
            await setDoc(doc(db, "employees", editingEmployee.id), { role: updatedEmployee.role }, { merge: true });
            setEmployees(employees.map(e => e.id === editingEmployee.id ? updatedEmployee : e));

            const newEventData: Omit<EsocialEvent, 'id'> = {
                type: "S-2206 - Alteração Contratual",
                employeeId: editingEmployee.id,
                employeeName: editingEmployee.name,
                referenceDate: new Date().toISOString().split('T')[0],
                status: "Pendente",
                details: `Alteração de contrato: ${changeData.newRole ? `Novo cargo: ${changeData.newRole}` : ''} ${changeData.newSalary ? `Novo salário: R$ ${changeData.newSalary}` : ''}`
            };

            const eventDocRef = await addDoc(collection(db, "esocialEvents"), newEventData);
            setEvents(prev => [...prev, { ...newEventData, id: eventDocRef.id }]);
            
            toast({
                title: "Evento eSocial Gerado!",
                description: "Um evento S-2206 (Alteração Contratual) foi adicionado à fila de envio do eSocial."
            });

            setIsContractChangeDialogOpen(false);
            setEditingEmployee(null);
        } catch (error) {
            console.error("Error handling contract change:", error);
            toast({ variant: "destructive", title: "Erro ao processar alteração contratual." });
        }
    }
    
    const handleTermination = (terminationData: { reasonCode: string, terminationDate: string }) => {
        if (!editingEmployee) return;

        startTransition(async () => {
            setIsTerminationDialogOpen(false);
            toast({
                title: "Processando Rescisão...",
                description: `Aguarde enquanto a IA gera os cálculos e o evento eSocial para ${editingEmployee.name}.`
            });

            try {
                const result = await generateTerminationData({
                    employeeId: editingEmployee.id,
                    reasonCode: terminationData.reasonCode,
                    terminationDate: terminationData.terminationDate,
                });
                
                await setDoc(doc(db, "employees", editingEmployee.id), { status: 'Inativo' }, { merge: true });
                setEmployees(employees.map(e => e.id === editingEmployee!.id ? { ...e, status: 'Inativo' } : e));

                const newEventData: Omit<EsocialEvent, 'id'> = {
                    type: "S-2299 - Desligamento",
                    employeeId: editingEmployee.id,
                    employeeName: editingEmployee.name,
                    referenceDate: terminationData.terminationDate,
                    status: "Pendente",
                    details: `Rescisão contratual. Motivo: ${terminationData.reasonCode}. Verbas: R$ ${result.terminationPaySummary.severancePay.toFixed(2)}`
                };
                const eventDocRef = await addDoc(collection(db, "esocialEvents"), newEventData);
                setEvents(prev => [...prev, { ...newEventData, id: eventDocRef.id }]);

                toast({
                    title: "Rescisão Processada com Sucesso!",
                    description: "O colaborador foi inativado e o evento S-2299 foi adicionado à fila do eSocial."
                });
                
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao Processar Rescisão",
                    description: "Não foi possível completar o processo de rescisão com a IA."
                });
            } finally {
                setEditingEmployee(null);
            }
        });
    }

    const handleScheduleVacation = (vacationData: { startDate: string, endDate: string, reasonCode: string }) => {
        if (!editingEmployee) return;
        
        startTransition(async () => {
            setIsVacationDialogOpen(false);
            toast({
                title: "Processando Férias...",
                description: `Aguarde enquanto a IA gera o evento eSocial para ${editingEmployee.name}.`
            });
            try {
                 await generateVacationData({
                    employeeId: editingEmployee.id,
                    startDate: vacationData.startDate,
                    endDate: vacationData.endDate,
                    reasonCode: vacationData.reasonCode,
                });

                await setDoc(doc(db, "employees", editingEmployee.id), { status: 'Férias' }, { merge: true });
                setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, status: 'Férias' } : e));
                
                const newEventData: Omit<EsocialEvent, 'id'> = {
                    type: "S-2230 - Afastamento Temporário",
                    employeeId: editingEmployee.id,
                    employeeName: editingEmployee.name,
                    referenceDate: vacationData.startDate,
                    status: "Pendente",
                    details: `Início do afastamento por férias de ${vacationData.startDate} a ${vacationData.endDate}.`
                };
                const eventDocRef = await addDoc(collection(db, "esocialEvents"), newEventData);
                setEvents(prev => [...prev, { ...newEventData, id: eventDocRef.id }]);

                toast({
                    title: "Férias Programadas e Evento Gerado!",
                    description: `O status de ${editingEmployee.name} foi alterado e o evento S-2230 foi adicionado à fila do eSocial.`
                });
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Erro ao Programar Férias",
                    description: "Não foi possível gerar o evento S-2230 para as férias com a IA."
                });
            } finally {
                setEditingEmployee(null);
            }
        });
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-headline tracking-tight">Gestão de Colaboradores</h1>
                        <p className="text-muted-foreground">Adicione, edite e gerencie as informações dos seus colaboradores.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <FileDown className="mr-2" />
                            Importar
                        </Button>
                        <Button onClick={() => handleOpenEmployeeDialog()}>
                            <PlusCircle className="mr-2" />
                            Adicionar Colaborador
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filtros de Busca</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Buscar por nome..." 
                                    className="pl-10" 
                                    value={nameFilter}
                                    onChange={e => setNameFilter(e.target.value)}
                                />
                            </div>
                            <Select value={companyFilter} onValueChange={setCompanyFilter}>
                                <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Filtrar por empresa" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as Empresas</SelectItem>
                                    {companies.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={unitFilter} onValueChange={setUnitFilter}>
                                <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Filtrar por unidade" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as Unidades</SelectItem>
                                    {units.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Colaboradores</CardTitle>
                        <CardDescription>
                            Exibindo {filteredEmployees.length} de {employees.length} colaboradores.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmployeesTable 
                            data={filteredEmployees}
                            onEdit={handleOpenEmployeeDialog}
                            onDeactivate={handleOpenDeactivateDialog}
                            onContractChange={handleOpenContractChangeDialog}
                            onScheduleVacation={handleOpenVacationDialog}
                        />
                    </CardContent>
                </Card>
            </div>

            <EmployeeDialog
                isOpen={isEmployeeDialogOpen}
                onClose={handleCloseEmployeeDialog}
                onSave={handleSaveEmployee}
                employee={editingEmployee}
                units={units}
                roles={roles}
                workShifts={workShifts}
                companies={companies}
            />
            
             <ContractChangeDialog
                isOpen={isContractChangeDialogOpen}
                onClose={() => setIsContractChangeDialogOpen(false)}
                onSave={handleContractChange}
                employee={editingEmployee}
                roles={roles}
            />
            
            <TerminationDialog
                isOpen={isTerminationDialogOpen}
                onClose={() => setIsTerminationDialogOpen(false)}
                onSave={handleTermination}
                employee={editingEmployee}
                isProcessing={isProcessing}
            />

            <VacationDialog
                isOpen={isVacationDialogOpen}
                onClose={() => setIsVacationDialogOpen(false)}
                onSave={handleScheduleVacation}
                employee={editingEmployee}
                isProcessing={isProcessing}
            />
        </AppLayout>
    );
}

    