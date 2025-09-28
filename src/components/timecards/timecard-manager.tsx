'use client'

import { useState, useTransition } from 'react'
import { reformatTimecard } from '@/ai/flows/timecard-refactoring'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Wand2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { initialTimecardData } from '@/lib/data'

export function TimecardManager() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [timecardInput, setTimecardInput] = useState(initialTimecardData)
  const [reformattedData, setReformattedData] = useState('')
  const [reformattingRequired, setReformattingRequired] = useState<boolean | null>(null)

  const handleReformat = () => {
    startTransition(async () => {
      try {
        const result = await reformatTimecard({ timecardData: timecardInput })
        setReformattedData(result.reformattedTimecardData)
        setReformattingRequired(result.reformattingRequired)
        toast({
          title: 'Processamento Concluído',
          description: result.reformattingRequired
            ? 'Os dados do cartão de ponto foram reformatados com sucesso.'
            : 'Nenhuma reformatação foi necessária para os dados fornecidos.',
        })
      } catch (error) {
        console.error('Erro ao reformatar o cartão de ponto:', error)
        toast({
          variant: 'destructive',
          title: 'Ocorreu um Erro',
          description: 'Falha ao reformatar os dados do cartão de ponto. Por favor, tente novamente.',
        })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramenta de Reformatação de Cartão de Ponto</CardTitle>
        <CardDescription>
          Cole os dados brutos do cartão de ponto abaixo e use a ferramenta de IA para reformatá-los em uma estrutura JSON consistente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timecard-input">Dados Brutos do Cartão de Ponto</Label>
            <Textarea
              id="timecard-input"
              value={timecardInput}
              onChange={(e) => setTimecardInput(e.target.value)}
              className="h-80 font-mono text-sm"
              placeholder='Insira ou cole os dados do cartão de ponto aqui... ex: "2024-07-20: IN 09:00, OUT 17:00"'
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reformatted-output">Saída JSON Reformatada</Label>
            <div className="relative">
              <Textarea
                id="reformatted-output"
                value={reformattedData ? JSON.stringify(JSON.parse(reformattedData), null, 2) : ''}
                readOnly
                className="h-80 font-mono text-sm bg-muted/50"
                placeholder="Os dados reformatados aparecerão aqui..."
              />
              {reformattingRequired !== null && (
                <Badge variant={reformattingRequired ? 'destructive' : 'secondary'} className="absolute top-3 right-3">
                  {reformattingRequired ? 'Reformatação Aplicada' : 'Sem Alterações'}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleReformat} disabled={isPending || !timecardInput}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Processando...' : 'Reformatar com IA'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
