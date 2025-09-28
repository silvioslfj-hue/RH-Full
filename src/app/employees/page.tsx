
"use client";

import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, FileDown, Search, Building, MapPin } from "lucide-react";
import { EmployeesTable } from "@/components/employees/employees-table";
import { EmployeeDialog } from "@/components/employees/employee-dialog";
import { employeeData as initialEmployeeData, unitData, roleData, workShiftData, companyData, esocialEventsData } from "@/lib/data";
import type { Employee, EsocialEvent } from "@/lib/data";
import { ContractChangeDialog } from "@/components/employees/contract-change-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function EmployeesPage() {
    const { toast } = useToast();
    const [employees, setEmployees] = useState(initialEmployeeData);
    const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
    const [isContractChangeDialogOpen, setIsContractChangeDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [events, setEvents] = useState<EsocialEvent[]>(esocialEventsData);

    const [nameFilter, setNameFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('all');
    const [unitFilter, setUnitFilter] = useState('all');

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

    const handleSaveEmployee = (employee: Employee) => {
        if (editingEmployee) {
            setEmployees(employees.map(e => e.id === employee.id ? employee : e));
        } else {
            const newEmployee = { ...employee, id: `FUNC${(employees.length + 1).toString().padStart(3, '0')}` };
            setEmployees([...employees, newEmployee]);
        }
        handleCloseEmployeeDialog();
    };

    const handleDeleteEmployee = (id: string) => {
        // In a real app, this would likely be a deactivation
        setEmployees(employees.filter(e => e.id !== id));
    };

    const handleOpenContractChangeDialog = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsContractChangeDialogOpen(true);
    };

    const handleContractChange = (changeData: { newSalary?: number; newRole?: string }) => {
        if (!editingEmployee) return;

        // 1. Update employee data (simulation)
        setEmployees(employees.map(e => e.id === editingEmployee.id ? { 
            ...e, 
            role: changeData.newRole || e.role,
            // In real app, salary would be updated somewhere else
        } : e));

        // 2. Create a new eSocial event
        const newEvent: EsocialEvent = {
            id: `EVT${(events.length + 1).toString().padStart(3, '0')}`,
            type: "S-2206 - Alteração Contratual",
            employeeId: editingEmployee.id,
            employeeName: editingEmployee.name,
            referenceDate: new Date().toISOString().split('T')[0],
            status: "Pendente",
            details: `Alteração de contrato: ${changeData.newRole ? `Novo cargo: ${changeData.newRole}` : ''} ${changeData.newSalary ? `Novo salário: R$ ${changeData.newSalary}` : ''}`
        };
        // In a real app, this would be saved to the database.
        // For this demo, we can log it or, if we had a shared state, add it to the global state.
        console.log("Novo evento eSocial gerado:", newEvent);
        
        toast({
            title: "Evento eSocial Gerado!",
            description: "Um evento S-2206 (Alteração Contratual) foi adicionado à fila de envio do eSocial."
        })

        setIsContractChangeDialogOpen(false);
        setEditingEmployee(null);
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
                                    {companyData.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
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
                                    {unitData.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}
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
                            onDelete={handleDeleteEmployee}
                            onContractChange={handleOpenContractChangeDialog}
                        />
                    </CardContent>
                </Card>
            </div>

            <EmployeeDialog
                isOpen={isEmployeeDialogOpen}
                onClose={handleCloseEmployeeDialog}
                onSave={handleSaveEmployee}
                employee={editingEmployee}
                units={unitData}
                roles={roleData}
                workShifts={workShiftData}
                companies={companyData}
            />
            
             <ContractChangeDialog
                isOpen={isContractChangeDialogOpen}
                onClose={() => setIsContractChangeDialogOpen(false)}
                onSave={handleContractChange}
                employee={editingEmployee}
                roles={roleData}
            />
        </AppLayout>
    );
}
