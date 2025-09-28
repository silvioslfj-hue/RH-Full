
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, FileDown } from "lucide-react";
import { EmployeesTable } from "@/components/employees/employees-table";
import { EmployeeDialog } from "@/components/employees/employee-dialog";
import { employeeData as initialEmployeeData, unitData, roleData, workShiftData } from "@/lib/data";
import type { Employee } from "@/lib/data";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState(initialEmployeeData);
    const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

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
            />
        </AppLayout>
    );
}
