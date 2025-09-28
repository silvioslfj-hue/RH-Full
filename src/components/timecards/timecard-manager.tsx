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
          title: 'Processing Complete',
          description: result.reformattingRequired
            ? 'Timecard data has been successfully reformatted.'
            : 'No reformatting was necessary for the provided data.',
        })
      } catch (error) {
        console.error('Error reformatting timecard:', error)
        toast({
          variant: 'destructive',
          title: 'An Error Occurred',
          description: 'Failed to reformat timecard data. Please try again.',
        })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timecard Refactoring Tool</CardTitle>
        <CardDescription>
          Paste raw timecard data below and use the AI tool to reformat it into a consistent JSON structure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timecard-input">Raw Timecard Data</Label>
            <Textarea
              id="timecard-input"
              value={timecardInput}
              onChange={(e) => setTimecardInput(e.target.value)}
              className="h-80 font-mono text-sm"
              placeholder='Enter or paste timecard data here... e.g., "2024-07-20: IN 09:00, OUT 17:00"'
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reformatted-output">Reformatted JSON Output</Label>
            <div className="relative">
              <Textarea
                id="reformatted-output"
                value={reformattedData ? JSON.stringify(JSON.parse(reformattedData), null, 2) : ''}
                readOnly
                className="h-80 font-mono text-sm bg-muted/50"
                placeholder="Reformatted data will appear here..."
              />
              {reformattingRequired !== null && (
                <Badge variant={reformattingRequired ? 'destructive' : 'secondary'} className="absolute top-3 right-3">
                  {reformattingRequired ? 'Reformatting Applied' : 'No Changes'}
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
            {isPending ? 'Processing...' : 'Reformat with AI'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
