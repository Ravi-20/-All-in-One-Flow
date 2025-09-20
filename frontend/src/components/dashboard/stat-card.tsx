import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  format?: 'number' | 'currency' | 'percentage' | 'text'
  progress?: number
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  format = 'text',
  progress 
}: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    
    switch (format) {
      case 'number':
        return formatNumber(val)
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return `${val}%`
      default:
        return val.toString()
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change !== undefined && (
          <p className={`text-xs ${getChangeColor(change)} mt-1`}>
            {change > 0 ? '+' : ''}{change}% from last month
          </p>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progress}% completion
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}