
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Employee } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface TerminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { reasonCode: string; terminationDate: string }) => void;
  employee: Employee | null;
  isProcessing: boolean;
}

// Based on eSocial Table 19
const terminationReasons = [
    { code: "01", description: "Rescisão com justa causa, por iniciativa do empregador" },
    { code: "02", description: "Rescisão sem justa causa, por iniciativa do empregador" },
    { code: "03", description: "Rescisão antecipada de contrato a termo por iniciativa do empregador" },
    { code: "04", description: "Rescisão por término de contrato a termo" },
    { code: "05", description: "Rescisão por iniciativa do empregado" },
    { code: "06", description: "Rescisão por culpa recíproca" },
];

export function TerminationDialog({ isOpen, onClose, onSave, employee, isProcessing }: TerminationDialogProps) {
  const [terminationDate, setTerminationDate] = useState('');
  const [reasonCode, setReasonCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setTerminationDate(new Date().toISOString().split('T')[0]);
      setReasonCode('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!reasonCode || !terminationDate) {
      toast({
        variant: "destructive",
        title: "Campos Obrigatórios",
        description: "A data e o motivo do desligamento são obrigatórios.",
      });
      return;
    }
    
    onSave({ reasonCode, terminationDate });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Iniciar Processo de Rescisão para {employee?.name}</DialogTitle>
          <DialogDescription>
            Confirme os detalhes do desligamento. Esta ação irá inativar o colaborador e gerar o evento S-2299 para o eSocial.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="space-y-2">
                <Label htmlFor="termination-date">Data do Desligamento</Label>
                <Input id="termination-date" type="date" value={terminationDate} onChange={(e) => setTerminationDate(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="termination-reason">Motivo do Desligamento (eSocial)</Label>
                <Select value={reasonCode} onValueChange={setReasonCode}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o motivo da rescisão..." />
                    </SelectTrigger>
                    <SelectContent>
                        {terminationReasons.map(r => <SelectItem key={r.code} value={r.code}>({r.code}) {r.description}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? "Processando..." : "Confirmar Rescisão"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
