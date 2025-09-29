
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { MoreHorizontal, Ban, Trash2, Download, CheckCircle, AlertCircle } from "lucide-react";
import type { EsocialEvent } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ESocialEventsTableProps {
  data: EsocialEvent[];
  selectedEvents: string[];
  onSelectedEventsChange: (ids: string[]) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (event: EsocialEvent) => void;
}

export function ESocialEventsTable({ 
    data, 
    selectedEvents,
    onSelectedEventsChange,
    onReject,
    onDelete,
    onDownload,
}: ESocialEventsTableProps) {
    
  const pendingEvents = data.filter(d => d.status === 'Pendente');
  const isAllSelected = pendingEvents.length > 0 && selectedEvents.length === pendingEvents.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedEventsChange(pendingEvents.map(d => d.id));
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
      case "XML Gerado":
        return "default";
      case "Erro":
        return "destructive";
      case "Rejeitado":
        return "outline";
      default:
        return "outline";
    }
  };
  
  const getStatusIcon = (status: EsocialEvent['status']) => {
    switch (status) {
      case "XML Gerado":
        return <CheckCircle className="mr-2 h-4 w-4" />;
      case "Erro":
        return <AlertCircle className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  }

  return (
    <TooltipProvider>
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead padding="checkbox" className="w-[60px] text-center">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                aria-label="Selecionar todos os eventos pendentes"
                disabled={pendingEvents.length === 0}
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
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum evento encontrado para esta competência.
              </TableCell>
            </TableRow>
          ) : (
            data.map((event) => (
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
                  <Badge variant={getStatusVariant(event.status)} className="items-center">
                     {getStatusIcon(event.status)}
                     {event.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                   {event.status === "XML Gerado" ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onDownload(event)}>
                                <Download className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Baixar XML</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       {event.status === "Erro" && (
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Ver erro
                          </DropdownMenuItem>
                      )}
                      {(event.status === 'Pendente' || event.status === 'Erro') && (
                          <>
                          <DropdownMenuSeparator />
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Rejeitar Evento
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Rejeitar este evento?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação marcará o evento como "Rejeitado" e o removerá da fila de envio. Ele permanecerá no histórico para fins de auditoria. Você tem certeza?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => onReject(event.id)}>Sim, Rejeitar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir Evento
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir este evento permanentemente?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. O evento será removido para sempre e não aparecerá em relatórios futuros. Considere "Rejeitar" se precisar manter um registro.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => onDelete(event.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Sim, Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                    )}
                </TableCell>
              </TableRow>
            )))}
        </TableBody>
      </Table>
    </div>
    </TooltipProvider>
  );
}
