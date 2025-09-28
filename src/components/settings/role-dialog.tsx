
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
import { Textarea } from '@/components/ui/textarea';
import type { Role } from '@/lib/data';

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
  role: Role | null;
}

export function RoleDialog({ isOpen, onClose, onSave, role }: RoleDialogProps) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDepartment(role.department);
      setDescription(role.description);
    } else {
      setName('');
      setDepartment('');
      setDescription('');
    }
  }, [role, isOpen]);

  const handleSubmit = () => {
    const roleData = {
      id: role ? role.id : '',
      name,
      department,
      description,
    };
    onSave(roleData);
  };

  const title = role ? 'Editar Cargo' : 'Adicionar Novo Cargo';
  const dialogDescription = role
    ? 'Altere as informações do cargo abaixo.'
    : 'Preencha os detalhes do novo cargo.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-name">Nome do Cargo</Label>
            <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Desenvolvedor Sênior" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Ex: Tecnologia" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva as responsabilidades do cargo." />
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
