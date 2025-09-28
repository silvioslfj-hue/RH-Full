'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { attendanceReportData } from '@/lib/data'

const chartConfig = {
  Presentes: {
    label: 'Presentes',
    color: 'hsl(var(--chart-1))',
  },
  Ausentes: {
    label: 'Ausentes',
    color: 'hsl(var(--chart-2))',
  },
}

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presença Diária</CardTitle>
        <CardDescription>Funcionários presentes vs. ausentes nos últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={attendanceReportData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <YAxis />
            <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="Presentes" stackId="a" fill="var(--color-Presentes)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Ausentes" stackId="a" fill="var(--color-Ausentes)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
