import { AppLayout } from "@/components/layout/app-layout";
import { TimecardManager } from "@/components/timecards/timecard-manager";

export default function TimecardsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Timecard Management</h1>
          <p className="text-muted-foreground">Generate and reformat employee timecards for payroll processing.</p>
        </div>
        <TimecardManager />
      </div>
    </AppLayout>
  );
}
