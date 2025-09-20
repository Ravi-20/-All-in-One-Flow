'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Wifi, Bell, Zap } from 'lucide-react'
import { useRealTime } from '@/hooks/useRealTime'

export function RealTimeIndicator() {
  const { isConnected, notifications } = useRealTime()
  
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-1">
        <Wifi className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
        <Badge variant={isConnected ? 'success' : 'secondary'} className="text-xs">
          {isConnected ? 'Live' : 'Offline'}
        </Badge>
      </div>
      
      {unreadCount > 0 && (
        <div className="flex items-center space-x-1">
          <Bell className="h-4 w-4 text-blue-500" />
          <Badge variant="info" className="text-xs">
            {unreadCount} new
          </Badge>
        </div>
      )}
      
      <div className="flex items-center space-x-1 text-muted-foreground">
        <Zap className="h-3 w-3" />
        <span className="text-xs">Real-time updates enabled</span>
      </div>
    </div>
  )
}

export default RealTimeIndicator