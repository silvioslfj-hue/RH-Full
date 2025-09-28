
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
import type { Employee, Role } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface ContractChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (changeData: { newSalary?: number; newRole?: string }) => void;
  employee: Employee | null;
  roles: Role[];
}

export function ContractChangeDialog({ isOpen, onClose, onSave, employee, roles }: ContractChangeDialogProps) {
  const [newSalary, setNewSalary] = useState<number | undefined>();
  const [newRole, setNewRole] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (employee) {
      setNewRole(employee.role);
      // We don't pre-fill salary to force an explicit change
      setNewSalary(undefined);
    }
  }, [employee, isOpen]);

  const handleSubmit = () => {
    if (!newSalary && newRole === employee?.role) {
      toast({
        variant: "destructive",
        title: "Nenhuma Alteração Detectada",
        description: "Altere o salário ou o cargo para salvar.",
      });
      return;
    }
    
    onSave({
      newSalary: newSalary,
      newRole: newRole !== employee?.role ? newRole : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Contrato de {employee?.name}</DialogTitle>
          <DialogDescription>
            Modifique o salário ou o cargo do colaborador. Uma nova data de alteração será registrada e um evento S-2206 será gerado para o eSocial.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="space-y-2">
                <Label htmlFor="change-date">Data da Alteração</Label>
                <Input id="change-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-salary">Novo Salário Base (opcional)</Label>
                <Input
                    id="new-salary"
                    type="number"
                    placeholder="Deixe em branco para não alterar"
                    value={newSalary || ''}
                    onChange={(e) => setNewSalary(parseFloat(e.target.value))}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-role">Novo Cargo (opcional)</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo..." />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
