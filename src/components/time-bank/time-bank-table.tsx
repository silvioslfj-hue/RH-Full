
"use client"

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
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { TimeBankEntry } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface TimeBankTableProps {
  data: TimeBankEntry[];
}

export function TimeBankTable({ data }: TimeBankTableProps) {
    const getStatusVariant = (status: TimeBankEntry['status']) => {
        switch (status) {
        case 'Crítico':
            return 'destructive'
        case 'Atenção':
            return 'secondary' // Often yellow, but secondary is a good fit here
        case 'OK':
            return 'default'
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
                <TableHead>Colaborador</TableHead>
                <TableHead>Saldo Atual</TableHead>
                <TableHead>Horas a Expirar</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((entry) => (
            <TableRow key={entry.employeeId}>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={entry.avatar} alt={entry.employeeName} />
                            <AvatarFallback>{getInitials(entry.employeeName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{entry.employeeName}</p>
                            <p className="text-sm text-muted-foreground">{entry.role}</p>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="font-mono">{entry.balance}</TableCell>
                <TableCell className="font-mono text-destructive">{entry.expiringHours}</TableCell>
                <TableCell>{entry.expiryDate}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(entry.status)}>{entry.status}</Badge>
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
                        <DropdownMenuItem>Ver Espelho de Ponto</DropdownMenuItem>
                        <DropdownMenuItem>Agendar Folga Compensatória</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    )
}
