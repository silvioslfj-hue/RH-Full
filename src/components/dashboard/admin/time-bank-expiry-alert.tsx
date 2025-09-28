
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Bank, BarChart3 } from "lucide-react";
import Link from "next/link";

interface TimeBankExpiryAlertProps {
    count: number;
}

export function TimeBankExpiryAlert({ count }: TimeBankExpiryAlertProps) {
  return (
    <Alert className="flex items-center justify-between border-amber-500/50 bg-amber-500/5">
      <div className="flex items-center">
        <Bank className="h-5 w-5 mr-3 text-amber-600" />
        <div>
            <AlertTitle className="font-bold text-amber-800">Alerta de Banco de Horas</AlertTitle>
            <AlertDescription className="text-amber-700">
                Você tem <strong>{count} {count > 1 ? 'colaboradores' : 'colaborador'}</strong> com banco de horas próximo do vencimento.
            </AlertDescription>
        </div>
      </div>
      <Button asChild variant="outline">
        <Link href="/reports">
            <BarChart3 className="mr-2 h-4 w-4" />
            Ver Relatório
        </Link>
      </Button>
    </Alert>
  );
}
