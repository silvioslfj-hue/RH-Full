"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { AbsenceTable } from "@/components/absences/absence-table";
import { RequestAbsenceDialog } from "@/components/absences/request-absence-dialog";
import { absenceData as initialAbsenceData } from "@/lib/data";
import { PlusCircle } from "lucide-react";

export default function AbsencesPage() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [absenceData, setAbsenceData] = useState(initialAbsenceData);

  const handleNewRequest = (newRequest: any) => {
    setAbsenceData(prev => [{...newRequest, id: `ABS${(prev.length + 1).toString().padStart(3, '0')}`, status: 'Pendente'}, ...prev])
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Gestão de Ausências</h1>
            <p className="text-muted-foreground">Solicite folgas e visualize o histórico de ausências.</p>
          </div>
          <Button onClick={() => setIsRequestDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Solicitar Folga
          </Button>
        </div>
        
        <AbsenceTable data={absenceData} />
      </div>
      <RequestAbsenceDialog 
        isOpen={isRequestDialogOpen}
        onClose={() => setIsRequestDialogOpen(false)}
        onSuccess={handleNewRequest}
      />
    </AppLayout>
  );
}
