import { AppLayout } from "@/components/layout/app-layout";
import { ClockWidget } from "@/components/dashboard/clock-widget";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { summaryData } from "@/lib/data";
import { Activity, BarChart, Calendar, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Painel</h1>
          <p className="text-muted-foreground">Bem-vinda de volta, Jane! Aqui está sua visão geral.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-2">
            <ClockWidget />
          </div>
          {summaryData.map((item, index) => (
            <SummaryCard key={index} {...item} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Futuro conteúdo pode ser adicionado aqui */}
        </div>
      </div>
    </AppLayout>
  );
}
