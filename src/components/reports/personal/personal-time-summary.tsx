import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Hourglass, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { personalTimeReportData as data } from '@/lib/data'

export function PersonalTimeSummary() {
  const getChangeIcon = () => {
    switch (data.timeBankChangeType) {
      case 'positive': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'negative': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  }

  const getChangeColor = () => {
    switch (data.timeBankChangeType) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Horas Trabalhadas (Mês Atual)</CardTitle>
                <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.workedHours}</div>
                <p className="text-xs text-muted-foreground">Total de horas registradas este mês.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo do Banco de Horas</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.timeBank}</div>
                 <p className={`text-xs ${getChangeColor()} flex items-center`}>
                    {getChangeIcon()}
                    {data.timeBankChange}
                </p>
            </CardContent>
        </Card>
    </div>
  )
}
