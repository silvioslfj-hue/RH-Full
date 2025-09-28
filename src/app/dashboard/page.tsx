
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { QuickActions } from "@/components/dashboard/admin/quick-actions";
import { TeamStatus } from "@/components/dashboard/admin/team-status";
import { RecentAbsenceRequests } from "@/components/dashboard/admin/recent-absence-requests";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Factory } from "lucide-react";
import { absenceData as initialAbsenceData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [company, setCompany] = useState("all");
  const [unit, setUnit] = useState("all");
  const [absenceData, setAbsenceData] = useState(initialAbsenceData);
  const { toast } = useToast();

  const handleStatusChange = (id: string, status: 'Aprovado' | 'Negado') => {
    setAbsenceData(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    toast({
        title: `Solicitação ${status === 'Aprovado' ? 'Aprovada' : 'Negada'}`,
        description: `A solicitação de ausência foi marcada como "${status}".`,
    });
  };

  const pendingRequests = absenceData.filter(a => a.status === "Pendente");


  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Painel do Administrador</h1>
          <p className="text-muted-foreground">Bem-vinda de volta, Jane! Aqui está sua visão geral da equipe.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por Empresa" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Empresas</SelectItem>
                <SelectItem value="cnpj1">01.234.567/0001-89 (Matriz)</SelectItem>
                <SelectItem value="cnpj2">02.345.678/0001-90 (Filial)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Factory className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por Unidade" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Unidades</SelectItem>
                <SelectItem value="sp">São Paulo - SP</SelectItem>
                <SelectItem value="rj">Rio de Janeiro - RJ</SelectItem>
                <SelectItem value="mg">Belo Horizonte - MG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <QuickActions pendingRequestsCount={pendingRequests.length} />

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentAbsenceRequests requests={pendingRequests} onStatusChange={handleStatusChange} />
          </div>
          <TeamStatus />
        </div>
      </div>
    </AppLayout>
  );
}
