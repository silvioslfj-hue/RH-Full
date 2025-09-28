'use client'

import { Pie, PieChart, Cell, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { personalTimeOffData } from '@/lib/data'

const chartConfig = {
  count: {
    label: 'Dias',
  },
  'Férias': {
    label: 'Férias',
    color: 'hsl(var(--chart-1))',
  },
  'Licença Médica': {
    label: 'Licença Médica',
    color: 'hsl(var(--chart-2))',
  },
  'Pessoal': {
    label: 'Pessoal',
    color: 'hsl(var(--chart-4))',
  },
}

export function PersonalTimeOffChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Ausências</CardTitle>
        <CardDescription>Detalhamento dos seus tipos de ausência no ano.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={personalTimeOffData} dataKey="count" nameKey="type" innerRadius={60} strokeWidth={5}>
              {personalTimeOffData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="type" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
