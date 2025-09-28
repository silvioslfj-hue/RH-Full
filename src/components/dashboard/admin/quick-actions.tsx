
"use client"

import { SummaryCard } from "@/components/dashboard/summary-card";
import { Users, Clock, AlertCircle, FileCheck2, FileArchive } from "lucide-react";

interface QuickActionsProps {
  pendingAbsenceRequestsCount: number;
  pendingESocialEventsCount: number;
  timecardAlertsCount: number;
  activeEmployeesCount: number;
}

export function QuickActions({ 
  pendingAbsenceRequestsCount, 
  pendingESocialEventsCount,
  timecardAlertsCount,
  activeEmployeesCount
}: QuickActionsProps) {
  const quickActionsData = [
    {
      title: "Aprovações Pendentes",
      value: pendingAbsenceRequestsCount.toString(),
      description: "Solicitações de ausência",
      icon: FileCheck2,
      href: "/absences"
    },
    {
      title: "Eventos eSocial",
      value: pendingESocialEventsCount.toString(),
      description: "Eventos pendentes de envio",
      icon: FileArchive,
      href: "/esocial"
    },
    {
      title: "Alertas de Ponto",
      value: timecardAlertsCount.toString(),
      description: "Marcações inconsistentes",
      icon: AlertCircle,
      href: "/timecards"
    },
    {
      title: "Total de Colaboradores",
      value: activeEmployeesCount.toString(),
      description: "Funcionários ativos",
      icon: Users,
      href: "/employees"
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
