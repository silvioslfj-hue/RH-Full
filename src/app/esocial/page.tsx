
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { KeyRound, Settings, Send } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";


export default function ESocialPage() {
    const { toast } = useToast();

    const handleSendEvents = () => {
        toast({
            title: "Envio em Simulação",
            description: "Os eventos do eSocial seriam gerados e enviados para a API do governo neste momento.",
        })
    }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            eSocial
          </h1>
          <p className="text-muted-foreground">
            Gerencie a geração e o envio de eventos para o eSocial.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Painel de Controle do eSocial</CardTitle>
            <CardDescription>
              Centralize o envio das informações trabalhistas, fiscais e previdenciárias.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
                <KeyRound className="h-4 w-4" />
                <AlertTitle>Integração e Automação</AlertTitle>
                <AlertDescription>
                    Para automatizar o envio dos eventos para o eSocial, é fundamental que a sua empresa tenha um <strong>Certificado Digital A1</strong> configurado no sistema. O certificado é a identidade eletrônica da sua empresa e garante a validade jurídica dos envios.
                </AlertDescription>
            </Alert>
             <div className="p-6 border rounded-lg bg-muted/30 text-center">
                <h3 className="text-lg font-semibold">Pronto para começar?</h3>
                <p className="text-muted-foreground mt-1 mb-4">Gere e envie os eventos periódicos e não periódicos com segurança.</p>
                 <Button onClick={handleSendEvents}>
                    <Send className="mr-2 h-4 w-4"/>
                    Gerar e Enviar Eventos
                </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
             <Button variant="outline" asChild>
                <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar Certificado Digital
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
