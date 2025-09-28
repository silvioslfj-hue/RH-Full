"use client"

import { SummaryCard } from "@/components/dashboard/summary-card";
import { Users, Clock, AlertCircle, FileCheck2 } from "lucide-react";

interface QuickActionsProps {
  pendingRequestsCount: number;
}

export function QuickActions({ pendingRequestsCount }: QuickActionsProps) {
  const quickActionsData = [
    {
      title: "Aprovações Pendentes",
      value: pendingRequestsCount.toString(),
      description: "Solicitações de ausência",
      icon: FileCheck2
    },
    {
      title: "Horas Extras a Revisar",
      value: "12.5h",
      description: "Nesta semana",
      icon: Clock
    },
    {
      title: "Alertas de Ponto",
      value: "2",
      description: "Marcações inconsistentes",
      icon: AlertCircle
    },
    {
      title: "Total de Colaboradores",
      value: "105",
      description: "Funcionários ativos",
      icon: Users
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {quickActionsData.map((item, index) => (
        <SummaryCard key={index} {...item} />
      ))}
    </div>
  );
}
