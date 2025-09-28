"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileArchive, Send } from "lucide-react";
import Link from "next/link";

interface ESocialPendingAlertProps {
    count: number;
}

export function ESocialPendingAlert({ count }: ESocialPendingAlertProps) {
  return (
    <Alert className="flex items-center justify-between">
      <div className="flex items-center">
        <FileArchive className="h-5 w-5 mr-3" />
        <div>
            <AlertTitle className="font-bold">Pendências no eSocial!</AlertTitle>
            <AlertDescription>
                Você tem <strong>{count} {count > 1 ? 'eventos que precisam' : 'evento que precisa'}</strong> ser enviado para o eSocial.
            </AlertDescription>
        </div>
      </div>
      <Button asChild>
        <Link href="/esocial">
            <Send className="mr-2 h-4 w-4" />
            Gerenciar Envios
        </Link>
      </Button>
    </Alert>
  );
}
