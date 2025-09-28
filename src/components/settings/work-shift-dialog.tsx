

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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import type { WorkShift } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

interface WorkShiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workShift: WorkShift) => void;
  workShift: WorkShift | null;
}

const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export function WorkShiftDialog({ isOpen, onClose, onSave, workShift }: WorkShiftDialogProps) {
  const [name, setName] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakDuration, setBreakDuration] = useState([60]);
  const [tolerance, setTolerance] = useState([10]);
  const { toast } = useToast();

  useEffect(() => {
    if (workShift) {
      setName(workShift.name);
      setDays(workShift.days);
      setStartTime(workShift.startTime);
      setEndTime(workShift.endTime);
      setBreakDuration([workShift.breakDuration]);
      setTolerance([workShift.tolerance]);
    } else {
      // Reset form
      setName('');
      setDays([]);
      setStartTime('09:00');
      setEndTime('18:00');
      setBreakDuration([60]);
      setTolerance([10]);
    }
  }, [workShift, isOpen]);
  

  const handleSubmit = () => {
    if(!name || days.length === 0 || !startTime || !endTime) {
        toast({
            variant: "destructive",
            title: "Campos Obrigatórios",
            description: "Por favor, preencha o nome, dias da semana e horários.",
        });
        return;
    }
    const workShiftData: WorkShift = {
      id: workShift ? workShift.id : '',
      name,
      days,
      startTime,
      endTime,
      breakDuration: breakDuration[0],
      tolerance: tolerance[0],
    };
    onSave(workShiftData);
  };

  const title = workShift ? 'Editar Jornada de Trabalho' : 'Adicionar Nova Jornada';
  const description = workShift
    ? 'Altere as informações da jornada abaixo.'
    : 'Preencha os detalhes da nova jornada de trabalho.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="shift-name">Nome da Jornada</Label>
            <Input id="shift-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Padrão (Seg-Sex)" />
          </div>
          
          <div className="space-y-2">
            <Label>Dias da Semana</Label>
            <ToggleGroup type="multiple" value={days} onValueChange={setDays} variant="outline">
                {weekDays.map(day => (
                    <ToggleGroupItem key={day} value={day} className="text-xs px-2 h-8">
                        {day.substring(0,3)}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Horário de Entrada</Label>
              <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">Horário de Saída</Label>
              <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="break-duration">Duração do Intervalo (em minutos)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="break-duration"
                min={0}
                max={120}
                step={15}
                value={breakDuration}
                onValueChange={setBreakDuration}
              />
              <span className="font-mono text-lg w-16 text-center">{breakDuration[0]} min</span>
            </div>
          </div>
          
          <Separator />
          
           <div className="space-y-2">
            <Label htmlFor="tolerance">Tolerância de Atraso na Entrada (em minutos)</Label>
             <p className="text-sm text-muted-foreground">Alertas serão gerados para marcações fora desta tolerância.</p>
            <div className="flex items-center gap-4">
              <Slider
                id="tolerance"
                min={0}
                max={30}
                step={1}
                value={tolerance}
                onValueChange={setTolerance}
              />
              <span className="font-mono text-lg w-16 text-center">{tolerance[0]} min</span>
            </div>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
