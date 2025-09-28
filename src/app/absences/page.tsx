
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { AbsenceTable } from "@/components/absences/absence-table";
import { RequestAbsenceDialog } from "@/components/absences/request-absence-dialog";
import { absenceData as initialAbsenceData } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Assume-se que o usuário logado é 'Jane Doe' para o protótipo.
const loggedInUser = "Jane Doe";

export default function AbsencesPage() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [absenceData, setAbsenceData] = useState(initialAbsenceData);
  const [isAdminView, setIsAdminView] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // No mundo real, a verificação do papel do usuário viria de um contexto de autenticação
    const role = window.sessionStorage.getItem('userRole');
    setIsAdminView(role === 'admin');
  }, []);

  const handleNewRequest = (newRequest: any) => {
    setAbsenceData(prev => [{...newRequest, id: `ABS${(prev.length + 1).toString().padStart(3, '0')}`, status: 'Pendente'}, ...prev])
  }
  
  const handleStatusChange = (id: string, status: 'Aprovado' | 'Negado') => {
    setAbsenceData(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    toast({
        title: `Solicitação ${status === 'Aprovado' ? 'Aprovada' : 'Negada'}`,
        description: `A solicitação de ausência foi marcada como "${status}".`,
    });
  };

  const handleCancelRequest = (id: string) => {
    setAbsenceData(prev => prev.filter(item => item.id !== id));
    toast({
        title: "Solicitação Cancelada",
        description: "Sua solicitação de ausência foi cancelada.",
    });
  }
  
  const pageTitle = isAdminView ? "Gestão de Ausências" : "Minhas Ausências";
  const pageDescription = isAdminView ? "Aprove, negue e visualize as solicitações de ausência da equipe." : "Solicite folgas e visualize o histórico de suas ausências.";

  const filteredData = !isAdminView 
    ? absenceData.filter(item => item.employee === loggedInUser)
    : absenceData;


  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageDescription}</p>
          </div>
          {!isAdminView && (
            <Button onClick={() => setIsRequestDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Solicitar Ausência
            </Button>
          )}
        </div>
        
        <AbsenceTable 
          data={filteredData} 
          isAdmin={isAdminView} 
          onStatusChange={handleStatusChange}
          onCancelRequest={handleCancelRequest}
        />
      </div>
      <RequestAbsenceDialog 
        isOpen={isRequestDialogOpen}
        onClose={() => setIsRequestDialogOpen(false)}
        onSuccess={handleNewRequest}
      />
    </AppLayout>
  );
}
