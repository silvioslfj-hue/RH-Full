
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
import type { Employee } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface VacationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { startDate: string; endDate: string; reasonCode: string }) => void;
  employee: Employee | null;
  isProcessing: boolean;
}

// Based on eSocial Table 18 for temporary leave
const leaveReasons = [
    { code: "15", description: "Férias" },
    { code: "01", description: "Licença Maternidade" },
    { code: "03", description: "Licença Médica (acima de 15 dias)" },
    { code: "17", description: "Licença Paternidade" },
];


export function VacationDialog({ isOpen, onClose, onSave, employee, isProcessing }: VacationDialogProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reasonCode, setReasonCode] = useState('15');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setStartDate('');
      setEndDate('');
      setReasonCode('15'); // Default to vacation
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!startDate || !endDate || !reasonCode) {
      toast({
        variant: "destructive",
        title: "Campos Obrigatórios",
        description: "As datas de início, fim e o motivo do afastamento são obrigatórios.",
      });
      return;
    }
    
    onSave({ startDate, endDate, reasonCode });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Programar Afastamento para {employee?.name}</DialogTitle>
          <DialogDescription>
            Selecione o período e o motivo. Esta ação gerará um evento S-2230 para o eSocial.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
                <Label htmlFor="reason-code">Motivo do Afastamento (eSocial)</Label>
                <Select value={reasonCode} onValueChange={setReasonCode}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o motivo..." />
                    </SelectTrigger>
                    <SelectContent>
                        {leaveReasons.map(r => <SelectItem key={r.code} value={r.code}>({r.code}) {r.description}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="start-date">Data de Início</Label>
                <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isProcessing} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="end-date">Data de Fim</Label>
                <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isProcessing} />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? "Processando..." : "Confirmar Afastamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
