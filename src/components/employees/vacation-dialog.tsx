
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

interface VacationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { startDate: string; endDate: string }) => void;
  employee: Employee | null;
}

export function VacationDialog({ isOpen, onClose, onSave, employee }: VacationDialogProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setStartDate('');
      setEndDate('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Campos Obrigatórios",
        description: "A data de início e fim das férias são obrigatórias.",
      });
      return;
    }
    
    onSave({ startDate, endDate });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Programar Férias para {employee?.name}</DialogTitle>
          <DialogDescription>
            Selecione o período de férias. O status do colaborador será alterado para "Férias".
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="start-date">Data de Início</Label>
                <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="end-date">Data de Fim</Label>
                <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Confirmar Férias
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
