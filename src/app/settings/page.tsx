
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Building, Briefcase, Clock, MapPin, UserCircle, Calculator } from "lucide-react";
import { UnitsTable } from "@/components/settings/units-table";
import { UnitDialog } from "@/components/settings/unit-dialog";
import { RolesTable } from "@/components/settings/roles-table";
import { RoleDialog } from "@/components/settings/role-dialog";
import { CompaniesTable } from "@/components/settings/companies-table";
import { CompanyDialog } from "@/components/settings/company-dialog";
import { WorkShiftsTable } from "@/components/settings/work-shifts-table";
import { WorkShiftDialog } from "@/components/settings/work-shift-dialog";
import { ManagersTable } from "@/components/settings/managers-table";
import { ManagerDialog } from "@/components/settings/manager-dialog";
import { unitData as initialUnitData, roleData as initialRoleData, companyData as initialCompanyData, workShiftData as initialWorkShiftData, managerData as initialManagerData } from "@/lib/data";
import type { Unit, Role, Company, WorkShift, Manager } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";


export default function SettingsPage() {
    const { toast } = useToast();
    const [units, setUnits] = useState(initialUnitData);
    const [roles, setRoles] = useState(initialRoleData);
    const [companies, setCompanies] = useState(initialCompanyData);
    const [workShifts, setWorkShifts] = useState(initialWorkShiftData);
    const [managers, setManagers] = useState(initialManagerData);

    const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
    const [isWorkShiftDialogOpen, setIsWorkShiftDialogOpen] = useState(false);
    const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);

    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [editingWorkShift, setEditingWorkShift] = useState<WorkShift | null>(null);
    const [editingManager, setEditingManager] = useState<Manager | null>(null);

    // State for payroll settings
    const [overtimeAction, setOvertimeAction] = useState("pay");
    const [pjExtraDaysAction, setPjExtraDaysAction] = useState("pay");

    const handleSavePayrollSettings = () => {
        // In a real app, this would save to a backend.
        toast({
            title: "Configurações Salvas",
            description: "As configurações da folha de pagamento foram atualizadas.",
        })
    }

    // Unit Handlers
    const handleOpenUnitDialog = (unit: Unit | null = null) => {
        setEditingUnit(unit);
        setIsUnitDialogOpen(true);
    };
    const handleCloseUnitDialog = () => {
        setEditingUnit(null);
        setIsUnitDialogOpen(false);
    };
    const handleSaveUnit = (unit: Unit) => {
        if (editingUnit) {
            setUnits(units.map(u => u.id === unit.id ? unit : u));
        } else {
            setUnits([...units, { ...unit, id: `UN${(units.length + 1).toString().padStart(3, '0')}` }]);
        }
        handleCloseUnitDialog();
    };
    const handleDeleteUnit = (id: string) => {
        setUnits(units.filter(u => u.id !== id));
    };

    // Role Handlers
    const handleOpenRoleDialog = (role: Role | null = null) => {
        setEditingRole(role);
        setIsRoleDialogOpen(true);
    };
    const handleCloseRoleDialog = () => {
        setEditingRole(null);
        setIsRoleDialogOpen(false);
    };
    const handleSaveRole = (role: Role) => {
        if (editingRole) {
            setRoles(roles.map(r => r.id === role.id ? role : r));
        } else {
            setRoles([...roles, { ...role, id: `CAR${(roles.length + 1).toString().padStart(3, '0')}` }]);
        }
        handleCloseRoleDialog();
    };
    const handleDeleteRole = (id: string) => {
        setRoles(roles.filter(r => r.id !== id));
    };

    // Company Handlers
    const handleOpenCompanyDialog = (company: Company | null = null) => {
        setEditingCompany(company);
        setIsCompanyDialogOpen(true);
    };
    const handleCloseCompanyDialog = () => {
        setEditingCompany(null);
        setIsCompanyDialogOpen(false);
    };
    const handleSaveCompany = (company: Company) => {
        if (editingCompany) {
            setCompanies(companies.map(c => c.id === company.id ? company : c));
        } else {
            setCompanies([...companies, { ...company, id: `EMP${(companies.length + 1).toString().padStart(3, '0')}` }]);
        }
        handleCloseCompanyDialog();
    };
    const handleDeleteCompany = (id: string) => {
        setCompanies(companies.filter(c => c.id !== id));
    };
    
    // Work Shift Handlers
    const handleOpenWorkShiftDialog = (workShift: WorkShift | null = null) => {
        setEditingWorkShift(workShift);
        setIsWorkShiftDialogOpen(true);
    };
    const handleCloseWorkShiftDialog = () => {
        setEditingWorkShift(null);
        setIsWorkShiftDialogOpen(false);
    };
    const handleSaveWorkShift = (workShift: WorkShift) => {
        if (editingWorkShift) {
            setWorkShifts(workShifts.map(ws => ws.id === workShift.id ? workShift : ws));
        } else {
            setWorkShifts([...workShifts, { ...workShift, id: `JOR${(workShifts.length + 1).toString().padStart(3, '0')}` }]);
        }
        handleCloseWorkShiftDialog();
    };
    const handleDeleteWorkShift = (id: string) => {
        setWorkShifts(workShifts.filter(ws => ws.id !== id));
    };
    
    // Manager Handlers
    const handleOpenManagerDialog = (manager: Manager | null = null) => {
        setEditingManager(manager);
        setIsManagerDialogOpen(true);
    };
    const handleCloseManagerDialog = () => {
        setEditingManager(null);
        setIsManagerDialogOpen(false);
    };
    const handleSaveManager = (manager: Manager) => {
        if (editingManager) {
            setManagers(managers.map(m => m.id === manager.id ? manager : m));
        } else {
            setManagers([...managers, { ...manager, id: `GES${(managers.length + 1).toString().padStart(3, '0')}` }]);
        }
        handleCloseManagerDialog();
    };
    const handleDeleteManager = (id: string) => {
        setManagers(managers.filter(m => m.id !== id));
    };


  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Configurações do Sistema
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações e estruturas fundamentais do seu ambiente de RH.
          </p>
        </div>

        <Tabs defaultValue="companies">
            <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="companies">
                    <Building className="mr-2" />
                    Empresas
                </TabsTrigger>
                <TabsTrigger value="units">
                    <MapPin className="mr-2" />
                    Unidades
                </TabsTrigger>
                <TabsTrigger value="roles">
                    <Briefcase className="mr-2" />
                    Cargos
                </TabsTrigger>
                 <TabsTrigger value="managers">
                    <UserCircle className="mr-2" />
                    Gestores
                </TabsTrigger>
                <TabsTrigger value="work-shifts">
                    <Clock className="mr-2" />
                    Jornadas
                </TabsTrigger>
                <TabsTrigger value="payroll">
                    <Calculator className="mr-2" />
                    Folha de Pagamento
                </TabsTrigger>
            </TabsList>

            <TabsContent value="companies" className="pt-6">
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Empresas</CardTitle>
                                <CardDescription>Gerencie as empresas e filiais cadastradas no sistema.</CardDescription>
                            </div>
                            <Button onClick={() => handleOpenCompanyDialog()}>
                                <PlusCircle className="mr-2" />
                                Adicionar Empresa
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CompaniesTable 
                            data={companies} 
                            onEdit={handleOpenCompanyDialog} 
                            onDelete={handleDeleteCompany} 
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="units" className="pt-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Unidades (Locais de Trabalho)</CardTitle>
                                <CardDescription>Gerencie os endereços e locais onde seus colaboradores trabalham.</CardDescription>
                            </div>
                            <Button onClick={() => handleOpenUnitDialog()}>
                                <PlusCircle className="mr-2" />
                                Adicionar Unidade
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <UnitsTable 
                            data={units} 
                            onEdit={handleOpenUnitDialog} 
                            onDelete={handleDeleteUnit} 
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="roles" className="pt-6">
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Cargos</CardTitle>
                                <CardDescription>Defina os cargos e os níveis hierárquicos da sua organização.</CardDescription>
                            </div>
                            <Button onClick={() => handleOpenRoleDialog()}>
                                <PlusCircle className="mr-2" />
                                Adicionar Cargo
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <RolesTable 
                            data={roles} 
                            onEdit={handleOpenRoleDialog} 
                            onDelete={handleDeleteRole} 
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="managers" className="pt-6">
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Gestores</CardTitle>
                                <CardDescription>Gerencie os gestores diretos que podem ser associados aos colaboradores.</CardDescription>
                            </div>
                            <Button onClick={() => handleOpenManagerDialog()}>
                                <PlusCircle className="mr-2" />
                                Adicionar Gestor
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ManagersTable
                            data={managers}
                            onEdit={handleOpenManagerDialog}
                            onDelete={handleDeleteManager}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="work-shifts" className="pt-6">
                 <Card>
                    <CardHeader>
                         <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Jornadas de Trabalho</CardTitle>
                                <CardDescription>Crie e gerencie os modelos de jornada de trabalho.</CardDescription>
                            </div>
                             <Button onClick={() => handleOpenWorkShiftDialog()}>
                                <PlusCircle className="mr-2" />
                                Adicionar Jornada
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <WorkShiftsTable
                            data={workShifts}
                            onEdit={handleOpenWorkShiftDialog}
                            onDelete={handleDeleteWorkShift}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="payroll" className="pt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configurações da Folha de Pagamento</CardTitle>
                        <CardDescription>Defina as regras e padrões para o processamento da folha de pagamento.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div>
                            <h3 className="text-lg font-semibold text-foreground">Contrato CLT</h3>
                            <Label className="text-base font-semibold">Ação Padrão para Horas Extras (CLT)</Label>
                            <p className="text-sm text-muted-foreground mb-4">
                                Escolha o que fazer com as horas extras apuradas no fechamento do ponto (caso não haja horas de banco de horas a vencer).
                            </p>
                            <RadioGroup value={overtimeAction} onValueChange={setOvertimeAction}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pay" id="clt-pay" />
                                    <Label htmlFor="clt-pay" className="font-normal">Pagar na Folha</Label>
                                </div>
                                <p className="text-xs text-muted-foreground pl-6">As horas extras serão calculadas com acréscimo de 50% ou 100% e adicionadas como provento no holerite do mês.</p>
                                
                                <div className="flex items-center space-x-2 mt-4">
                                    <RadioGroupItem value="bank" id="clt-bank" />
                                    <Label htmlFor="clt-bank" className="font-normal">Adicionar ao Banco de Horas</Label>
                                </div>
                                <p className="text-xs text-muted-foreground pl-6">As horas extras serão adicionadas ao saldo do banco de horas do colaborador para compensação futura.</p>
                            </RadioGroup>
                        </div>
                        <Separator />
                         <div>
                            <h3 className="text-lg font-semibold text-foreground">Contrato PJ</h3>
                            <Label className="text-base font-semibold">Ação Padrão para Dias Extras (PJ)</Label>
                            <p className="text-sm text-muted-foreground mb-4">
                                Escolha o que fazer se um colaborador PJ trabalhar mais dias do que o contratado no mês.
                            </p>
                            <RadioGroup value={pjExtraDaysAction} onValueChange={setPjExtraDaysAction}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pay" id="pj-pay" />
                                    <Label htmlFor="pj-pay" className="font-normal">Pagar na Folha</Label>
                                </div>
                                <p className="text-xs text-muted-foreground pl-6">O sistema calculará o valor dos dias excedentes e os adicionará como provento no pagamento.</p>
                                
                                <div className="flex items-center space-x-2 mt-4">
                                    <RadioGroupItem value="ignore" id="pj-ignore" />
                                    <Label htmlFor="pj-ignore" className="font-normal">Não Pagar (Ignorar)</Label>
                                </div>
                                <p className="text-xs text-muted-foreground pl-6">Os dias excedentes serão ignorados e nenhum pagamento adicional será gerado.</p>
                            </RadioGroup>
                        </div>
                    </CardContent>
                     <CardFooter className="border-t px-6 py-4">
                        <Button onClick={handleSavePayrollSettings}>Salvar Configurações</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
      </div>

       <UnitDialog
            isOpen={isUnitDialogOpen}
            onClose={handleCloseUnitDialog}
            onSave={handleSaveUnit}
            unit={editingUnit}
        />
        <RoleDialog
            isOpen={isRoleDialogOpen}
            onClose={handleCloseRoleDialog}
            onSave={handleSaveRole}
            role={editingRole}
        />
        <CompanyDialog
            isOpen={isCompanyDialogOpen}
            onClose={handleCloseCompanyDialog}
            onSave={handleSaveCompany}
            company={editingCompany}
        />
        <WorkShiftDialog
            isOpen={isWorkShiftDialogOpen}
            onClose={handleCloseWorkShiftDialog}
            onSave={handleSaveWorkShift}
            workShift={editingWorkShift}
        />
        <ManagerDialog
            isOpen={isManagerDialogOpen}
            onClose={handleCloseManagerDialog}
            onSave={handleSaveManager}
            manager={editingManager}
        />
    </AppLayout>
  );
}
