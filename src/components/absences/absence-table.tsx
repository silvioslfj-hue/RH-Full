'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

type Absence = {
  id: string;
  employee: string;
  startDate: string;
  endDate: string;
  type: string;
  status: 'Aprovado' | 'Pendente' | 'Negado';
};

interface AbsenceTableProps {
  data: Absence[];
  isAdmin: boolean;
  onStatusChange?: (id: string, status: 'Aprovado' | 'Negado') => void;
  onCancelRequest?: (id: string) => void;
}

export function AbsenceTable({ data, isAdmin, onStatusChange, onCancelRequest }: AbsenceTableProps) {
  const getStatusVariant = (status: Absence['status']) => {
    switch (status) {
      case 'Aprovado':
        return 'default'
      case 'Pendente':
        return 'secondary'
      case 'Negado':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Solicitações</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {isAdmin && <TableHead>Funcionário</TableHead>}
              <TableHead>Datas</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((absence) => (
              <TableRow key={absence.id}>
                {isAdmin && <TableCell className="font-medium">{absence.employee}</TableCell>}
                <TableCell>{absence.startDate} a {absence.endDate}</TableCell>
                <TableCell>{absence.type}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(absence.status)}>{absence.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {isAdmin && absence.status === 'Pendente' ? (
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => onStatusChange?.(absence.id, 'Aprovado')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => onStatusChange?.(absence.id, 'Negado')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                         {!isAdmin && absence.status === 'Pendente' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancelar Solicitação
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso cancelará permanentemente sua solicitação de ausência.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => onCancelRequest?.(absence.id)}>Sim, Cancelar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
