
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
import { MoreHorizontal, Pencil, UserX, FilePen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Employee } from "@/lib/data";

interface EmployeesTableProps {
  data: Employee[];
  onEdit: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
  onContractChange: (employee: Employee) => void;
}

export function EmployeesTable({ data, onEdit, onDeactivate, onContractChange }: EmployeesTableProps) {

  const getStatusVariant = (status: Employee['status']) => {
    switch (status) {
      case 'Ativo':
        return 'default'
      case 'Férias':
        return 'secondary'
      case 'Inativo':
        return 'destructive'
      default:
        return 'outline'
    }
  }
  
   const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                    <Avatar>
                        {employee.avatar && <AvatarImage src={employee.avatar} alt={employee.name} />}
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p>{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>{employee.company}</TableCell>
            <TableCell>{employee.role}</TableCell>
            <TableCell>{employee.unit}</TableCell>
            <TableCell>
                <Badge variant={getStatusVariant(employee.status)}>{employee.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={employee.status === 'Inativo'}>
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver Perfil Completo</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(employee)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar Colaborador
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onContractChange(employee)}>
                      <FilePen className="mr-2 h-4 w-4" />
                      Alterar Contrato
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDeactivate(employee)} className="text-red-500 focus:text-red-500">
                      <UserX className="mr-2 h-4 w-4" />
                      Iniciar Rescisão
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
