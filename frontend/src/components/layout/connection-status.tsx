'use client'

import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ConnectionStatusProps {
  isConnected: boolean
  connectionError: string | null
  onRetry?: () => void
}

export function ConnectionStatus({ 
  isConnected, 
  connectionError, 
  onRetry 
}: ConnectionStatusProps) {
  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <Wifi className="h-4 w-4" />
        <Badge variant="success" className="text-xs">
          Live
        </Badge>
      </div>
    )
  }

  if (connectionError) {
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <Badge variant="destructive" className="text-xs">
          Connection Failed
        </Badge>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="text-xs h-6 px-2"
          >
            Retry
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-yellow-600">
      <WifiOff className="h-4 w-4" />
      <Badge variant="warning" className="text-xs">
        Connecting...
      </Badge>
    </div>
  )
}

export default ConnectionStatus