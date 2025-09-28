import { AppLayout } from "@/components/layout/app-layout";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { summaryData } from "@/lib/data";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Resumo</h1>
          <p className="text-muted-foreground">Bem-vinda de volta, Jane! Aqui está sua visão geral.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
