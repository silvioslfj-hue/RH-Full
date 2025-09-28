
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
import type { GeneratedJobOpening } from "@/lib/data";

interface JobOpeningsTableProps {
  data: GeneratedJobOpening[];
  onEdit: (job: GeneratedJobOpening) => void;
  onDelete: (id: string) => void;
}

export function JobOpeningsTable({ data, onEdit, onDelete }: JobOpeningsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título do Cargo</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
            <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                    Nenhuma vaga gerada ainda.
                </TableCell>
            </TableRow>
        ) : (
            data.map((job) => (
                <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.role}</TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(job)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar / Visualizar
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
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o material gerado para esta vaga.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(job.id)}>Sim, Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))
        )}
      </TableBody>
    </Table>
  )
}
