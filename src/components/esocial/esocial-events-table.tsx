
"use client"

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { EsocialEvent } from "@/lib/data";

interface ESocialEventsTableProps {
  data: EsocialEvent[];
  selectedEvents: string[];
  onSelectedEventsChange: (ids: string[]) => void;
}

export function ESocialEventsTable({ 
    data, 
    selectedEvents,
    onSelectedEventsChange
}: ESocialEventsTableProps) {
    
  const isAllSelected = data.length > 0 && selectedEvents.length === data.filter(d => d.status === 'Pendente').length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedEventsChange(data.filter(d => d.status === 'Pendente').map(d => d.id));
    } else {
      onSelectedEventsChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectedEventsChange([...selectedEvents, id]);
    } else {
      onSelectedEventsChange(selectedEvents.filter(eventId => eventId !== id));
    }
  };

  const getStatusVariant = (status: EsocialEvent['status']) => {
    switch (status) {
      case "Pendente":
        return "secondary";
      case "Enviado":
        return "default";
      case "Erro":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead padding="checkbox" className="w-[60px] text-center">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Selecionar todos"
              />
            </TableHead>
            <TableHead>Tipo de Evento</TableHead>
            <TableHead>Colaborador</TableHead>
            <TableHead>Data de Referência</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((event) => (
            <TableRow key={event.id} data-state={selectedEvents.includes(event.id) && "selected"}>
              <TableCell padding="checkbox" className="text-center">
                <Checkbox
                  checked={selectedEvents.includes(event.id)}
                  onCheckedChange={(checked) => handleSelectOne(event.id, !!checked)}
                  aria-label={`Selecionar evento ${event.id}`}
                  disabled={event.status !== 'Pendente'}
                />
              </TableCell>
              <TableCell className="font-medium">{event.type}</TableCell>
              <TableCell>{event.employeeName}</TableCell>
              <TableCell>{event.referenceDate}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(event.status)}>
                  {event.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver detalhes XML</DropdownMenuItem>
                    {event.status === "Erro" && (
                        <DropdownMenuItem className="text-destructive">Ver erro</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
