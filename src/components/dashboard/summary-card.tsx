
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface SummaryCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  href: string;
}

export function SummaryCard({ title, value, description, icon: Icon, href }: SummaryCardProps) {
  return (
    <Link href={href}>
        <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
        </Card>
    </Link>
  )
}
