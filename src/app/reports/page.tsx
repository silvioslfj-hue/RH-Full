import { AppLayout } from "@/components/layout/app-layout";
import { AttendanceChart } from "@/components/reports/attendance-chart";
import { TimeOffChart } from "@/components/reports/time-off-chart";

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Análises e insights sobre os dados da sua força de trabalho.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
            <AttendanceChart />
            <TimeOffChart />
        </div>
      </div>
    </AppLayout>
  );
}
