

"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import type { WorkShift } from "@/lib/data";
import { Badge } from "../ui/badge";

interface WorkShiftsTableProps {
  data: WorkShift[];
  onEdit: (workShift: WorkShift) => void;
  onDelete: (id: string) => void;
}

export function WorkShiftsTable({ data, onEdit, onDelete }: WorkShiftsTableProps) {
  
  const formatTotalHours = (shift: WorkShift) => {
    if (!shift.startTime || !shift.endTime) return 'N/A';
    const start = new Date(`1970-01-01T${shift.startTime}`);
    const end = new Date(`1970-01-01T${shift.endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const totalMinutes = Math.floor(diffMs / 60000);
    const workMinutes = totalMinutes - shift.breakDuration;
    const hours = Math.floor(workMinutes / 60);
    const minutes = workMinutes % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}min`;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome da Jornada</TableHead>
          <TableHead>Horários</TableHead>
          <TableHead>Carga Horária</TableHead>
          <TableHead>Dias</TableHead>
          <TableHead>Tolerância</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((shift) => (
          <TableRow key={shift.id}>
            <TableCell className="font-medium">{shift.name}</TableCell>
            <TableCell className="font-mono">{shift.startTime} - {shift.endTime} (Intervalo: {shift.breakDuration}min)</TableCell>
            <TableCell>{formatTotalHours(shift)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1 max-w-xs">
                {shift.days.map(day => <Badge key={day} variant="secondary">{day}</Badge>)}
              </div>
            </TableCell>
            <TableCell className="font-mono">{shift.tolerance} min</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(shift)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente a jornada de trabalho.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(shift.id)}>Sim, Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
