
import { AppLayout } from "@/components/layout/app-layout";
import { PersonalTimeSummary } from "@/components/reports/personal/personal-time-summary";
import { LateAverageChart } from "@/components/reports/personal/late-average-chart";
import { PersonalTimeOffChart } from "@/components/reports/personal/personal-time-off-chart";
import { TimeBankAlert } from "@/components/reports/personal/time-bank-alert";

export default function MyReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Meus Relatórios</h1>
          <p className="text-muted-foreground">Sua performance, banco de horas e resumo de ausências.</p>
        </div>
        
        <TimeBankAlert hours="18 horas" expiryDate="15/10/2024" />

        <PersonalTimeSummary />

        <div className="grid gap-6 md:grid-cols-2">
          <LateAverageChart />
          <PersonalTimeOffChart />
        </div>
      </div>
    </AppLayout>
  );
}
