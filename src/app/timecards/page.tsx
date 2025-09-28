import { AppLayout } from "@/components/layout/app-layout";
import { TimecardManager } from "@/components/timecards/timecard-manager";

export default function TimecardsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Gestão de Cartões de Ponto</h1>
          <p className="text-muted-foreground">Gere e reformate os cartões de ponto dos funcionários para o processamento da folha de pagamento.</p>
        </div>
        <TimecardManager />
      </div>
    </AppLayout>
  );
}
