import { AppLayout } from "@/components/layout/app-layout";
import { QuickActions } from "@/components/dashboard/admin/quick-actions";
import { TeamStatus } from "@/components/dashboard/admin/team-status";
import { RecentAbsenceRequests } from "@/components/dashboard/admin/recent-absence-requests";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Painel do Administrador</h1>
          <p className="text-muted-foreground">Bem-vinda de volta, Jane! Aqui está sua visão geral da equipe.</p>
        </div>
        
        <QuickActions />

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentAbsenceRequests />
          </div>
          <TeamStatus />
        </div>
      </div>
    </AppLayout>
  );
}
