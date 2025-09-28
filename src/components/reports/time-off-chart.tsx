'use client'

import { Pie, PieChart, Cell, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { timeOffReportData } from '@/lib/data'

const chartConfig = {
  count: {
    label: 'Count',
  },
  Vacation: {
    label: 'Vacation',
    color: 'hsl(var(--chart-1))',
  },
  'Sick Leave': {
    label: 'Sick Leave',
    color: 'hsl(var(--chart-2))',
  },
  Personal: {
    label: 'Personal',
    color: 'hsl(var(--chart-4))',
  },
  Unpaid: {
    label: 'Unpaid',
    color: 'hsl(var(--chart-5))',
  },
}

export function TimeOffChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Off Distribution</CardTitle>
        <CardDescription>Breakdown of absence types this quarter</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={timeOffReportData} dataKey="count" nameKey="type" innerRadius={60} strokeWidth={5}>
              {timeOffReportData.map((entry, index) => (
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
