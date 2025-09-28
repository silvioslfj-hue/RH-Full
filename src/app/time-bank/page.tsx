
"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Factory, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimeBankExpiryAlert } from "@/components/dashboard/admin/time-bank-expiry-alert";
import { timeBankData as initialTimeBankData, companyData, unitData, employeeData } from "@/lib/data";
import { TimeBankTable } from "@/components/time-bank/time-bank-table";

export default function TimeBankPage() {
  const [timeBankData, setTimeBankData] = useState(initialTimeBankData);
  
  const expiringCount = useMemo(() => {
    return timeBankData.filter(item => item.status === 'Crítico' || item.status === 'Atenção').length;
  }, [timeBankData]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Gestão de Banco de Horas</h1>
          <p className="text-muted-foreground">Monitore e gerencie o saldo de horas dos colaboradores.</p>
        </div>

        {expiringCount > 0 && (
            <TimeBankExpiryAlert count={expiringCount} />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Filtros de Busca</CardTitle>
            <CardDescription>Filtre o relatório por empresa, unidade ou colaborador específico.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Todas as Empresas" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Empresas</SelectItem>
                  {companyData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Factory className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Todas as Unidades" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Unidades</SelectItem>
                  {unitData.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Todos os Colaboradores" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Colaboradores</SelectItem>
                  {employeeData.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Button>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatório de Banco de Horas</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeBankTable data={timeBankData} />
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
