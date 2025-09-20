'use client'

import { useState } from 'react'
import { Bell, X, Check, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { RealTimeNotification } from '@/hooks/useRealTime'
import { cn } from '@/lib/utils'

interface NotificationsPanelProps {
  notifications: RealTimeNotification[]
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export function NotificationsPanel({ 
  notifications, 
  onMarkAsRead, 
  onClearAll 
}: NotificationsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: RealTimeNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getNotificationStyle = (type: RealTimeNotification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'error':
        return 'border-l-red-500 bg-red-50'
      default:
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 max-w-[90vw] z-50">
            <Card className="shadow-lg border">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearAll}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No notifications yet</p>
                      <p className="text-sm">You'll receive real-time updates here</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.slice(0, 50).map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 border-l-4 transition-colors hover:bg-gray-50 cursor-pointer",
                            getNotificationStyle(notification.type),
                            notification.read ? 'opacity-60' : ''
                          )}
                          onClick={() => {
                            if (!notification.read) {
                              onMarkAsRead(notification.id)
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm text-foreground">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationsPanel