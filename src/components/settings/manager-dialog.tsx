
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
import type { Manager } from '@/lib/data';

interface ManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (manager: Manager) => void;
  manager: Manager | null;
}

export function ManagerDialog({ isOpen, onClose, onSave, manager }: ManagerDialogProps) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (manager) {
      setName(manager.name);
      setDepartment(manager.department);
    } else {
      setName('');
      setDepartment('');
    }
  }, [manager, isOpen]);

  const handleSubmit = () => {
    const managerData = {
      id: manager ? manager.id : '',
      name,
      department,
    };
    onSave(managerData);
  };

  const title = manager ? 'Editar Gestor' : 'Adicionar Novo Gestor';
  const dialogDescription = manager
    ? 'Altere as informações do gestor abaixo.'
    : 'Preencha os detalhes do novo gestor.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="manager-name">Nome do Gestor</Label>
            <Input id="manager-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Carlos Souza" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Ex: Tecnologia" />
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
