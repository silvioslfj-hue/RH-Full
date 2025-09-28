
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Hourglass, BarChart3 } from "lucide-react";
import Link from "next/link";
import { TimeBankTable } from "@/components/time-bank/time-bank-table";
import type { TimeBankEntry } from "@/lib/data";

interface TimeBankExpiryAlertProps {
  count: number;
  data: TimeBankEntry[];
}

export function TimeBankExpiryAlert({ count, data }: TimeBankExpiryAlertProps) {
  return (
    <Dialog>
      <Alert className="flex items-center justify-between border-amber-500/50 bg-amber-500/5">
        <div className="flex items-center">
          <Hourglass className="h-5 w-5 mr-3 text-amber-600" />
          <div>
            <AlertTitle className="font-bold text-amber-800">
              Alerta de Banco de Horas
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              Você tem{" "}
              <strong>
                {count} {count > 1 ? "colaboradores" : "colaborador"}
              </strong>{" "}
              com banco de horas próximo do vencimento.
            </AlertDescription>
          </div>
        </div>
        <DialogTrigger asChild>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
        </DialogTrigger>
      </Alert>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Colaboradores com Banco de Horas a Expirar</DialogTitle>
          <DialogDescription>
            Abaixo estão os colaboradores com saldos de horas que exigem atenção.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <TimeBankTable data={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
