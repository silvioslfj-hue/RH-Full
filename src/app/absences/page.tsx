"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { AbsenceTable } from "@/components/absences/absence-table";
import { RequestAbsenceDialog } from "@/components/absences/request-absence-dialog";
import { absenceData as initialAbsenceData } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

// Assume-se que o usuário logado é 'Jane Doe' para o protótipo.
const loggedInUser = "Jane Doe";

export default function AbsencesPage() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [absenceData, setAbsenceData] = useState(initialAbsenceData);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNewRequest = (newRequest: any) => {
    setAbsenceData(prev => [{...newRequest, id: `ABS${(prev.length + 1).toString().padStart(3, '0')}`, status: 'Pendente'}, ...prev])
  }

  // A lógica do isAdminRoute pode ser substituída por uma verificação de perfil de usuário real.
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/timecards') || pathname.startsWith('/reports');
  
  const pageTitle = isAdminRoute ? "Gestão de Ausências" : "Minhas Ausências";
  const pageDescription = isAdminRoute ? "Aprove, negue e visualize as solicitações de ausência da equipe." : "Solicite folgas e visualize o histórico de suas ausências.";

  const filteredData = isClient && !isAdminRoute 
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
          {!isAdminRoute && (
            <Button onClick={() => setIsRequestDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Solicitar Ausência
            </Button>
          )}
        </div>
        
        <AbsenceTable data={filteredData} isAdmin={isAdminRoute} />
      </div>
      <RequestAbsenceDialog 
        isOpen={isRequestDialogOpen}
        onClose={() => setIsRequestDialogOpen(false)}
        onSuccess={handleNewRequest}
      />
    </AppLayout>
  );
}
