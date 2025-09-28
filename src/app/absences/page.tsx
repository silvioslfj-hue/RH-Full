
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { AbsenceTable } from "@/components/absences/absence-table";
import { RequestAbsenceDialog } from "@/components/absences/request-absence-dialog";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import type { Absence } from "@/lib/data";

// Assume-se que o usuário logado é 'Jane Doe' para o protótipo.
const loggedInUser = "Jane Doe";

export default function AbsencesPage() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [absenceData, setAbsenceData] = useState<Absence[]>([]);
  const [isAdminView, setIsAdminView] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // No mundo real, a verificação do papel do usuário viria de um contexto de autenticação
    const role = window.sessionStorage.getItem('userRole');
    setIsAdminView(role === 'admin');

    const fetchAbsences = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "absences"));
            const absences = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Absence));
            setAbsenceData(absences);
        } catch (error) {
            console.error("Error fetching absences: ", error);
            toast({ variant: "destructive", title: "Erro ao buscar dados de ausências." });
        }
    }
    fetchAbsences();

  }, [toast]);

  const handleNewRequest = async (newRequest: Omit<Absence, 'id' | 'status'>) => {
    try {
      const docRef = await addDoc(collection(db, "absences"), {
        ...newRequest,
        status: 'Pendente',
      });
      setAbsenceData(prev => [{ ...newRequest, id: docRef.id, status: 'Pendente' }, ...prev]);
      toast({
          title: "Solicitação Enviada",
          description: "Sua solicitação de ausência foi enviada para aprovação.",
      });
    } catch (error) {
       console.error("Error adding absence: ", error);
       toast({ variant: "destructive", title: "Erro ao enviar solicitação." });
    }
  }
  
  const handleStatusChange = async (id: string, status: 'Aprovado' | 'Negado') => {
    try {
      const absenceRef = doc(db, "absences", id);
      await updateDoc(absenceRef, { status });
      setAbsenceData(prev => prev.map(item => item.id === id ? { ...item, status } : item));
      toast({
          title: `Solicitação ${status === 'Aprovado' ? 'Aprovada' : 'Negada'}`,
          description: `A solicitação de ausência foi marcada como "${status}".`,
      });
    } catch (error) {
      console.error("Error updating absence status: ", error);
      toast({ variant: "destructive", title: "Erro ao atualizar status." });
    }
  };

  const handleCancelRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "absences", id));
      setAbsenceData(prev => prev.filter(item => item.id !== id));
      toast({
          title: "Solicitação Cancelada",
          description: "Sua solicitação de ausência foi cancelada.",
      });
    } catch (error) {
       console.error("Error cancelling absence request: ", error);
       toast({ variant: "destructive", title: "Erro ao cancelar solicitação." });
    }
  }
  
  const pageTitle = isAdminView ? "Gestão de Ausências" : "Minhas Ausências";
  const pageDescription = isAdminView ? "Aprove, negue e visualize as solicitações de ausência da equipe." : "Solicite folgas e visualize o histórico de suas ausências.";

  const pendingRequests = absenceData.filter(item => item.status === 'Pendente');
  const evaluatedRequests = absenceData.filter(item => item.status !== 'Pendente');

  const collaboratorRequests = absenceData.filter(item => item.employee === loggedInUser);

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
        
        {isAdminView ? (
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">
                Solicitações Pendentes
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold w-5 h-5">
                  {pendingRequests.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="pt-4">
               <AbsenceTable 
                data={pendingRequests} 
                isAdmin={true} 
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            <TabsContent value="history" className="pt-4">
               <AbsenceTable 
                data={evaluatedRequests} 
                isAdmin={true}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <AbsenceTable 
            data={collaboratorRequests} 
            isAdmin={false} 
            onCancelRequest={handleCancelRequest}
          />
        )}
      </div>
      <RequestAbsenceDialog 
        isOpen={isRequestDialogOpen}
        onClose={() => setIsRequestDialogOpen(false)}
        onSuccess={handleNewRequest}
      />
    </AppLayout>
  );
}
