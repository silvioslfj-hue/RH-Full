
"use client"

import { SummaryCard } from "@/components/dashboard/summary-card";
import { Users, TrendingUp, TrendingDown, Hourglass, Percent } from "lucide-react";

const summaryData = [
    {
      title: "Total de Colaboradores",
      value: "105",
      description: "+2 este mês",
      icon: Users
    },
    {
      title: "Taxa de Absenteísmo",
      value: "2.1%",
      description: "Média do mês",
      icon: Percent
    },
    {
      title: "Horas Extras (Mês)",
      value: "82.5h",
      description: "-5% vs. mês anterior",
      icon: Hourglass
    },
    {
      title: "Taxa de Rotatividade (Turnover)",
      value: "1.5%",
      description: "Anualizada",
      icon: TrendingUp
    },
  ];

export function ReportsSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => (
        <SummaryCard key={index} {...item} />
      ))}
    </div>
  );
}
