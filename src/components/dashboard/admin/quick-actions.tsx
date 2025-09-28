"use client"

import { SummaryCard } from "@/components/dashboard/summary-card";
import { Users, Clock, AlertCircle, FileCheck2, FileArchive } from "lucide-react";

interface QuickActionsProps {
  pendingAbsenceRequestsCount: number;
  pendingESocialEventsCount: number;
}

export function QuickActions({ pendingAbsenceRequestsCount, pendingESocialEventsCount }: QuickActionsProps) {
  const quickActionsData = [
    {
      title: "Aprovações Pendentes",
      value: pendingAbsenceRequestsCount.toString(),
      description: "Solicitações de ausência",
      icon: FileCheck2
    },
    {
      title: "Eventos eSocial",
      value: pendingESocialEventsCount.toString(),
      description: "Eventos pendentes de envio",
      icon: FileArchive
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
