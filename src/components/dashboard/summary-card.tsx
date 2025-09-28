import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'

interface SummaryCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
}

export function SummaryCard({ title, value, change, changeType }: SummaryCardProps) {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'negative': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <ArrowRight className="h-4 w-4 text-muted-foreground" />;
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${getChangeColor()} flex items-center`}>
          {getChangeIcon()}
          {change}
        </p>
      </CardContent>
    </Card>
  )
}
