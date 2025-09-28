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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { absenceData } from "@/lib/data"

const recentRequests = absenceData.filter(a => a.status === "Pendente").slice(0, 4);

export function RecentAbsenceRequests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitações de Ausência Recentes</CardTitle>
        <CardDescription>Aprove ou negue as solicitações pendentes da sua equipe.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Período</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.employee}</TableCell>
                <TableCell>
                    <Badge variant="secondary">{request.type}</Badge>
                </TableCell>
                <TableCell>{request.startDate} a {request.endDate}</TableCell>
                <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 border-green-600/50 hover:bg-green-100 hover:text-green-700">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 border-red-600/50 hover:bg-red-100 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
            <Button variant="ghost">Ver todas as solicitações</Button>
        </div>
      </CardContent>
    </Card>
  );
}
