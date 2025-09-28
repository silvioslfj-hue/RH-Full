'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { lateAverageData } from '@/lib/data'

const chartConfig = {
  "Média de Atraso": {
    label: 'Atraso (min)',
    color: 'hsl(var(--chart-1))',
  },
}

export function LateAverageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Média de Atrasos na Entrada</CardTitle>
        <CardDescription>Média de minutos de atraso por mês nos últimos 6 meses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={lateAverageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft', offset: -1 }} />
            <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="Média de Atraso" fill="var(--color-Média de Atraso)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
