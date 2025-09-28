
"use client";

import { useState, useEffect, useCallback } from "react";
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
import type { Unit, Role, Company, WorkShift, Manager } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";

export default function SettingsPage() {
    const { toast } = useToast();
    
    const [units, setUnits] = useState<Unit[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [workShifts, setWorkShifts] = useState<WorkShift[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);

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

    const [overtimeAction, setOvertimeAction] = useState("pay");
    const [pjExtraDaysAction, setPjExtraDaysAction] = useState("pay");

    const fetchData = useCallback(async (collectionName: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            const dataList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setter(dataList);
        } catch (error) {
            console.error(`Error fetching ${collectionName}:`, error);
            toast({ variant: "destructive", title: `Erro ao buscar dados de ${collectionName}` });
        }
    }, [toast]);

    useEffect(() => {
        fetchData("companies", setCompanies);
        fetchData("units", setUnits);
        fetchData("roles", setRoles);
        fetchData("managers", setManagers);
        fetchData("workShifts", setWorkShifts);
    }, [fetchData]);


    const handleSavePayrollSettings = () => {
        toast({
            title: "Configurações Salvas",
            description: "As configurações da folha de pagamento foram atualizadas.",
        })
    }

    // Generic Handlers
    const createHandleSave = <T extends { id: string }>(collectionName: string, setter: React.Dispatch<React.SetStateAction<T[]>>, editingItem: T | null, setEditingItem: (item: T | null) => void, closeDialog: () => void) => async (item: T) => {
        try {
            if (editingItem) {
                const docRef = doc(db, collectionName, item.id);
                await setDoc(docRef, item, { merge: true });
                setter(prev => prev.map(i => i.id === item.id ? item : i));
            } else {
                const docRef = await addDoc(collection(db, collectionName), item);
                setter(prev => [...prev, { ...item, id: docRef.id }]);
            }
            closeDialog();
        } catch (error) {
            console.error(`Error saving to ${collectionName}:`, error);
            toast({ variant: "destructive", title: `Erro ao salvar em ${collectionName}` });
        }
    };
    
    const createHandleDelete = <T extends { id: string }>(collectionName: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => async (id: string) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            setter(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error(`Error deleting from ${collectionName}:`, error);
            toast({ variant: "destructive", title: `Erro ao deletar de ${collectionName}` });
        }
    };

    // Dialog Openers
    const handleOpenDialog = <T extends { id: string }>(setter: (item: T | null) => void, setOpen: (open: boolean) => void) => (item: T | null = null) => {
        setter(item);
        setOpen(true);
    };

    // Specific Handlers
    const handleOpenUnitDialog = handleOpenDialog(setEditingUnit, setIsUnitDialogOpen);
    const handleCloseUnitDialog = () => setIsUnitDialogOpen(false);
    const handleSaveUnit = createHandleSave('units', setUnits, editingUnit, setEditingUnit, handleCloseUnitDialog);
    const handleDeleteUnit = createHandleDelete('units', setUnits);

    const handleOpenRoleDialog = handleOpenDialog(setEditingRole, setIsRoleDialogOpen);
    const handleCloseRoleDialog = () => setIsRoleDialogOpen(false);
    const handleSaveRole = createHandleSave('roles', setRoles, editingRole, setEditingRole, handleCloseRoleDialog);
    const handleDeleteRole = createHandleDelete('roles', setRoles);

    const handleOpenCompanyDialog = handleOpenDialog(setEditingCompany, setIsCompanyDialogOpen);
    const handleCloseCompanyDialog = () => setIsCompanyDialogOpen(false);
    const handleSaveCompany = createHandleSave('companies', setCompanies, editingCompany, setEditingCompany, handleCloseCompanyDialog);
    const handleDeleteCompany = createHandleDelete('companies', setCompanies);

    const handleOpenWorkShiftDialog = handleOpenDialog(setEditingWorkShift, setIsWorkShiftDialogOpen);
    const handleCloseWorkShiftDialog = () => setIsWorkShiftDialogOpen(false);
    const handleSaveWorkShift = createHandleSave('workShifts', setWorkShifts, editingWorkShift, setEditingWorkShift, handleCloseWorkShiftDialog);
    const handleDeleteWorkShift = createHandleDelete('workShifts', setWorkShifts);

    const handleOpenManagerDialog = handleOpenDialog(setEditingManager, setIsManagerDialogOpen);
    const handleCloseManagerDialog = () => setIsManagerDialogOpen(false);
    const handleSaveManager = createHandleSave('managers', setManagers, editingManager, setEditingManager, handleCloseManagerDialog);
    const handleDeleteManager = createHandleDelete('managers', setManagers);


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
