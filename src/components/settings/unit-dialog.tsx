
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
import type { Unit } from '@/lib/data';

interface UnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (unit: Unit) => void;
  unit: Unit | null;
}

export function UnitDialog({ isOpen, onClose, onSave, unit }: UnitDialogProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    if (unit) {
      setName(unit.name);
      setAddress(unit.address);
      setCity(unit.city);
      setState(unit.state);
      setZip(unit.zip);
    } else {
      // Reset form when adding a new unit
      setName('');
      setAddress('');
      setCity('');
      setState('');
      setZip('');
    }
  }, [unit, isOpen]);

  const handleSubmit = () => {
    const unitData = {
      id: unit ? unit.id : '', // ID will be generated in parent for new units
      name,
      address,
      city,
      state,
      zip,
    };
    onSave(unitData);
  };

  const title = unit ? 'Editar Unidade' : 'Adicionar Nova Unidade';
  const description = unit
    ? 'Altere as informações da unidade abaixo.'
    : 'Preencha os detalhes da nova unidade de trabalho.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="unit-name">Nome da Unidade</Label>
            <Input id="unit-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Filial São Paulo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ex: Av. Paulista, 1000" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="zip">CEP</Label>
            <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
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
