
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, FileDown } from "lucide-react";
import { EmployeesTable } from "@/components/employees/employees-table";
import { EmployeeDialog } from "@/components/employees/employee-dialog";
import { employeeData as initialEmployeeData, unitData, roleData, workShiftData, companyData, esocialEventsData } from "@/lib/data";
import type { Employee, EsocialEvent } from "@/lib/data";
import { ContractChangeDialog } from "@/components/employees/contract-change-dialog";
import { useToast } from "@/hooks/use-toast";

export default function EmployeesPage() {
    const { toast } = useToast();
    const [employees, setEmployees] = useState(initialEmployeeData);
    const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
    const [isContractChangeDialogOpen, setIsContractChangeDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [events, setEvents] = useState<EsocialEvent[]>(esocialEventsData);

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
            setEmployees([...employees, { ...employee, id: `FUNC${(employees.length + 1).toString().padStart(3, '0')}` }]);
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
                        <CardTitle>Lista de Colaboradores</CardTitle>
                        <CardDescription>Visualize todos os colaboradores e seus status atuais.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmployeesTable 
                            data={employees}
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
