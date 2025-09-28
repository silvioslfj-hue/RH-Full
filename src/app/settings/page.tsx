
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building, Briefcase, Clock, MapPin } from "lucide-react";
import { UnitsTable } from "@/components/settings/units-table";
import { UnitDialog } from "@/components/settings/unit-dialog";
import { unitData as initialUnitData } from "@/lib/data";
import type { Unit } from "@/lib/data";

function CompaniesTab() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Empresas</CardTitle>
                        <CardDescription>Gerencie as empresas e filiais cadastradas no sistema.</CardDescription>
                    </div>
                     <Button>
                        <PlusCircle className="mr-2" />
                        Adicionar Empresa
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-8">
                    <Building className="mx-auto h-12 w-12" />
                    <p className="mt-4">O gerenciamento de empresas será implementado em breve.</p>
                </div>
            </CardContent>
        </Card>
    )
}

function RolesTab() {
    return (
        <Card>
            <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Cargos</CardTitle>
                        <CardDescription>Defina os cargos utilizados na sua organização.</CardDescription>
                    </div>
                     <Button>
                        <PlusCircle className="mr-2" />
                        Adicionar Cargo
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="text-center text-muted-foreground py-8">
                    <Briefcase className="mx-auto h-12 w-12" />
                    <p className="mt-4">O gerenciamento de cargos será implementado em breve.</p>
                </div>
            </CardContent>
        </Card>
    )
}

function WorkShiftsTab() {
    return (
        <Card>
            <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Jornadas de Trabalho</CardTitle>
                        <CardDescription>Crie e gerencie os modelos de jornada de trabalho.</CardDescription>
                    </div>
                     <Button>
                        <PlusCircle className="mr-2" />
                        Adicionar Jornada
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="text-center text-muted-foreground py-8">
                    <Clock className="mx-auto h-12 w-12" />
                    <p className="mt-4">O gerenciamento de jornadas de trabalho será implementado em breve.</p>
                </div>
            </CardContent>
        </Card>
    )
}


export default function SettingsPage() {
    const [units, setUnits] = useState(initialUnitData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    const handleOpenDialog = (unit: Unit | null = null) => {
        setEditingUnit(unit);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setEditingUnit(null);
        setIsDialogOpen(false);
    };

    const handleSaveUnit = (unit: Unit) => {
        if (editingUnit) {
            setUnits(units.map(u => u.id === unit.id ? unit : u));
        } else {
            setUnits([...units, { ...unit, id: `UN${(units.length + 1).toString().padStart(3, '0')}` }]);
        }
        handleCloseDialog();
    };

    const handleDeleteUnit = (id: string) => {
        setUnits(units.filter(u => u.id !== id));
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

        <Tabs defaultValue="units">
            <TabsList className="grid w-full grid-cols-4">
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
                <TabsTrigger value="work-shifts">
                    <Clock className="mr-2" />
                    Jornadas
                </TabsTrigger>
            </TabsList>

            <TabsContent value="companies" className="pt-6">
                <CompaniesTab />
            </TabsContent>

            <TabsContent value="units" className="pt-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Unidades (Locais de Trabalho)</CardTitle>
                                <CardDescription>Gerencie os endereços e locais onde seus colaboradores trabalham.</CardDescription>
                            </div>
                            <Button onClick={() => handleOpenDialog()}>
                                <PlusCircle className="mr-2" />
                                Adicionar Unidade
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <UnitsTable 
                            data={units} 
                            onEdit={handleOpenDialog} 
                            onDelete={handleDeleteUnit} 
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="roles" className="pt-6">
                <RolesTab />
            </TabsContent>

            <TabsContent value="work-shifts" className="pt-6">
                <WorkShiftsTab />
            </TabsContent>
        </Tabs>
      </div>

       <UnitDialog
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            onSave={handleSaveUnit}
            unit={editingUnit}
        />
    </AppLayout>
  );
}
