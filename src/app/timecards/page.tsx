import { AppLayout } from "@/components/layout/app-layout";
import { TimecardManager } from "@/components/timecards/timecard-manager";

export default function TimecardsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Gestão de Registros de Ponto</h1>
          <p className="text-muted-foreground">Visualize, ajuste e aprove os registros de ponto dos funcionários.</p>
        </div>
        <TimecardManager />
      </div>
    </AppLayout>
  );
}
