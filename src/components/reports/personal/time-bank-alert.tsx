
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Bank, CalendarCheck } from "lucide-react";
import Link from "next/link";

interface TimeBankAlertProps {
    hours: string;
    expiryDate: string;
}

export function TimeBankAlert({ hours, expiryDate }: TimeBankAlertProps) {
  return (
    <Alert className="flex items-center justify-between">
      <div className="flex items-center">
        <Bank className="h-5 w-5 mr-3 text-primary" />
        <div>
            <AlertTitle className="font-bold">Seu banco de horas está prestes a expirar!</AlertTitle>
            <AlertDescription>
                Você tem <strong>{hours}</strong> que expiram em <strong>{expiryDate}</strong>.
            </AlertDescription>
        </div>
      </div>
      <Button asChild>
        <Link href="/absences">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Agendar Folga
        </Link>
      </Button>
    </Alert>
  );
}
