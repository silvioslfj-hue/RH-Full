import { AppLayout } from "@/components/layout/app-layout";
import { AttendanceChart } from "@/components/reports/attendance-chart";
import { TimeOffChart } from "@/components/reports/time-off-chart";

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Analytics and insights on your workforce data.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
            <AttendanceChart />
            <TimeOffChart />
        </div>
      </div>
    </AppLayout>
  );
}
