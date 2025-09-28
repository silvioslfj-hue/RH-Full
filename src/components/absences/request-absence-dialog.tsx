'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

interface RequestAbsenceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: any) => void
}

export function RequestAbsenceDialog({ isOpen, onClose, onSuccess }: RequestAbsenceDialogProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [absenceType, setAbsenceType] = useState('')

  const handleSubmit = () => {
    if (dateRange?.from && dateRange?.to && absenceType) {
        onSuccess({
            employee: 'Jane Doe', // Hardcoded for demo
            startDate: format(dateRange.from, 'yyyy-MM-dd'),
            endDate: format(dateRange.to, 'yyyy-MM-dd'),
            type: absenceType
        })
        onClose()
        // Reset state
        setDateRange(undefined)
        setAbsenceType('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Folga</DialogTitle>
          <DialogDescription>
            Selecione as datas e o motivo da sua ausência. Clique em enviar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee-name" className="text-right">
              Funcionário
            </Label>
            <Input id="employee-name" value="Jane Doe" disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Datas</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    'col-span-3 justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y', { locale: ptBR })} -{' '}
                        {format(dateRange.to, 'LLL dd, y', { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y', { locale: ptBR })
                    )
                  ) : (
                    <span>Escolha um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="absence-type" className="text-right">
              Tipo
            </Label>
            <Select onValueChange={setAbsenceType} value={absenceType}>
              <SelectTrigger id="absence-type" className="col-span-3">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Férias">Férias</SelectItem>
                <SelectItem value="Licença Médica">Licença Médica</SelectItem>
                <SelectItem value="Licença Pessoal">Licença Pessoal</SelectItem>
                <SelectItem value="Licença não remunerada">Licença não remunerada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Enviar Solicitação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
