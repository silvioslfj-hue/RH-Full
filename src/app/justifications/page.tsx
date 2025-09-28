"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function JustificationsPage() {
  const { toast } = useToast();
  const [justificationType, setJustificationType] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Solicitação Enviada",
      description: "Sua justificativa foi enviada para análise do RH.",
    });
    // Reset form
    setJustificationType("");
    setDate("");
    setReason("");
    setFile(null);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Justificativas e Solicitações</h1>
          <p className="text-muted-foreground">Envie atestados, solicite correções de ponto ou justifique suas ausências.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nova Solicitação</CardTitle>
            <CardDescription>Preencha o formulário abaixo para enviar sua justificativa.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="justification-type">Tipo de Solicitação</Label>
                  <Select onValueChange={setJustificationType} value={justificationType}>
                    <SelectTrigger id="justification-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical-certificate">Envio de Atestado Médico</SelectItem>
                      <SelectItem value="time-correction">Correção de Ponto</SelectItem>
                      <SelectItem value="other">Outra Justificativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data da Ocorrência</Label>
                  <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo / Descrição</Label>
                <Textarea
                  id="reason"
                  placeholder="Descreva o motivo da sua solicitação. Se for uma correção de ponto, informe os horários corretos."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Anexar Documento (Opcional)</Label>
                <Input id="file" type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
                <p className="text-sm text-muted-foreground">Anexe atestados ou outros documentos comprobatórios. Tamanho máx: 5MB.</p>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Enviar Solicitação</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
