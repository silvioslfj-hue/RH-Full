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
import { Check, X, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
}

export function AbsenceTable({ data }: AbsenceTableProps) {
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
        <CardTitle>Solicitações de Ausência</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Datas</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((absence) => (
              <TableRow key={absence.id}>
                <TableCell className="font-medium">{absence.employee}</TableCell>
                <TableCell>{absence.startDate} a {absence.endDate}</TableCell>
                <TableCell>{absence.type}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(absence.status)}>{absence.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {absence.status === 'Pendente' ? (
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700">
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
