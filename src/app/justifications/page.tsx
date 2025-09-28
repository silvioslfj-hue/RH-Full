
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
import { Upload, X, File, Camera } from "lucide-react";
import { DocumentScanner } from "@/components/justifications/document-scanner";
import { PendingAdjustments } from "@/components/justifications/pending-adjustments";

const pendingAdjustmentsData = [
  {
    id: "ADJ001",
    date: "2024-07-03",
    reason: "Esquecimento de marcação na saída.",
    requester: "Carlos Souza"
  }
];

export default function JustificationsPage() {
  const { toast } = useToast();
  const [justificationType, setJustificationType] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [pendingAdjustments, setPendingAdjustments] = useState(pendingAdjustmentsData);


  const handleJustify = (adjustment: typeof pendingAdjustmentsData[0]) => {
    setJustificationType("time-correction");
    setDate(adjustment.date);
    setReason(`Referente ao ajuste solicitado pelo gestor ${adjustment.requester}: ${adjustment.reason}\n\n`);
    document.getElementById('reason')?.focus();
  };


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

    if (reason.includes("Referente ao ajuste")) {
      setPendingAdjustments(prev => prev.filter(p => !reason.includes(p.reason)));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleScanComplete = (scannedFile: File) => {
    setFile(scannedFile);
    setIsScannerOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Justificativas e Solicitações</h1>
          <p className="text-muted-foreground">Envie atestados, solicite correções de ponto ou justifique suas ausências.</p>
        </div>
        
        {pendingAdjustments.length > 0 && (
          <PendingAdjustments
            adjustments={pendingAdjustments}
            onJustify={handleJustify}
          />
        )}


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
                <div className="flex items-center justify-between">
                    <Label htmlFor="file-upload">Anexar Documento</Label>
                    <Button variant="outline" size="sm" type="button" onClick={() => setIsScannerOpen(true)}>
                        <Camera className="mr-2 h-4 w-4" />
                        Escanear
                    </Button>
                </div>
                {file ? (
                  <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                    <div className="flex items-center gap-2">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemoveFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-center text-muted-foreground">
                        <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, PNG, JPG (máx. 5MB)</p>
                    </div>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit">Enviar Solicitação</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <DocumentScanner 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanComplete}
      />
    </AppLayout>
  );
}
