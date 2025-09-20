'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/stores/auth'
import { useProductionStore } from '@/stores/production'
import { useInventoryStore } from '@/stores/inventory'
import socketService from '@/lib/socket'
import { ProductionOrder, Material, QualityCheck, WorkOrder, StockMovement } from '@/types'

export interface RealTimeNotification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface UseRealTimeReturn {
  isConnected: boolean
  connectionError: string | null
  notifications: RealTimeNotification[]
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
}

export function useRealTime(): UseRealTimeReturn {
  const { user, token, isAuthenticated } = useAuthStore()
  const productionStore = useProductionStore()
  const inventoryStore = useInventoryStore()
  
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([])
  const isInitialized = useRef(false)

  // Add notification helper
  const addNotification = (notification: Omit<RealTimeNotification, 'id' | 'read'>) => {
    const newNotification: RealTimeNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]) // Keep last 50
  }

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  useEffect(() => {
    if (!isAuthenticated || !user || !token || isInitialized.current) {
      return
    }

    const connectSocket = async () => {
      try {
        setConnectionError(null)
        await socketService.connect(token, user.id)
        setIsConnected(true)
        isInitialized.current = true

        // Join user's department for targeted updates
        if (user.department) {
          socketService.joinDepartment(user.department)
        }

        // Set up event listeners
        setupEventListeners()

        addNotification({
          type: 'success',
          title: 'Real-time Connection Established',
          message: 'You will now receive live updates for all manufacturing data.',
          timestamp: new Date()
        })

      } catch (error) {
        console.error('Failed to connect to real-time server:', error)
        setConnectionError(error instanceof Error ? error.message : 'Connection failed')
        setIsConnected(false)
      }
    }

    connectSocket()

    return () => {
      if (isInitialized.current) {
        socketService.disconnect()
        setIsConnected(false)
        isInitialized.current = false
      }
    }
  }, [isAuthenticated, user, token])

  const setupEventListeners = () => {
    // Production events
    socketService.on('production-updated', (data) => {
      const { type, order } = data
      
      switch (type) {
        case 'created':
          productionStore.addOrder(order)
          addNotification({
            type: 'info',
            title: 'New Production Order',
            message: `Production order ${order.orderNumber} has been created.`,
            timestamp: new Date()
          })
          break
        case 'updated':
          productionStore.updateOrder(order.id, order)
          addNotification({
            type: 'info',
            title: 'Production Order Updated',
            message: `Production order ${order.orderNumber} has been updated.`,
            timestamp: new Date()
          })
          break
        case 'deleted':
          productionStore.deleteOrder(order.id)
          addNotification({
            type: 'warning',
            title: 'Production Order Deleted',
            message: `Production order ${order.orderNumber} has been deleted.`,
            timestamp: new Date()
          })
          break
      }
    })

    socketService.on('work-order-updated', (data) => {
      const { type, workOrder, productionOrderId } = data
      
      productionStore.updateWorkOrder(productionOrderId, workOrder.id, workOrder)
      
      if (type === 'completed') {
        addNotification({
          type: 'success',
          title: 'Work Order Completed',
          message: `Work order ${workOrder.operation} has been completed.`,
          timestamp: new Date()
        })
      }
    })

    // Inventory events
    socketService.on('inventory-updated', (data) => {
      const { type, material } = data
      
      switch (type) {
        case 'created':
          inventoryStore.addMaterial(material)
          addNotification({
            type: 'info',
            title: 'New Material Added',
            message: `Material ${material.name} (${material.code}) has been added to inventory.`,
            timestamp: new Date()
          })
          break
        case 'updated':
          inventoryStore.updateMaterial(material.id, material)
          
          // Check for low stock alerts
          if (material.currentStock <= material.minimumStock) {
            addNotification({
              type: 'warning',
              title: 'Low Stock Alert',
              message: `${material.name} stock is running low (${material.currentStock} ${material.unit} remaining).`,
              timestamp: new Date()
            })
          }
          break
        case 'deleted':
          inventoryStore.deleteMaterial(material.id)
          addNotification({
            type: 'warning',
            title: 'Material Removed',
            message: `Material ${material.name} has been removed from inventory.`,
            timestamp: new Date()
          })
          break
      }
    })

    socketService.on('stock-movement', (data) => {
      const { movement, material } = data
      
      inventoryStore.addStockMovement(movement)
      inventoryStore.updateMaterial(material.id, material)
      
      addNotification({
        type: 'info',
        title: 'Stock Movement',
        message: `${movement.type === 'in' ? 'Received' : 'Consumed'} ${movement.quantity} ${material.unit} of ${material.name}.`,
        timestamp: new Date()
      })
    })

    // Quality events
    socketService.on('quality-updated', (data) => {
      const { type, qualityCheck, workOrderId } = data
      
      if (qualityCheck.status === 'failed') {
        addNotification({
          type: 'error',
          title: 'Quality Check Failed',
          message: `Quality check failed for work order. Immediate attention required.`,
          timestamp: new Date()
        })
      } else if (qualityCheck.status === 'passed') {
        addNotification({
          type: 'success',
          title: 'Quality Check Passed',
          message: `Quality check completed successfully.`,
          timestamp: new Date()
        })
      } else if (qualityCheck.status === 'rework_required') {
        addNotification({
          type: 'warning',
          title: 'Rework Required',
          message: `Quality check requires rework. Please review the quality parameters.`,
          timestamp: new Date()
        })
      }
    })

    // System notifications
    socketService.on('notification', (data) => {
      addNotification({
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date(data.timestamp)
      })
    })

    // User connection events
    socketService.on('user-connected', (data) => {
      console.log(`User ${data.username} connected`)
    })

    socketService.on('user-disconnected', (data) => {
      console.log(`User ${data.username} disconnected`)
    })

    // Metrics updates
    socketService.on('metrics-updated', (data) => {
      // Handle real-time metrics updates for dashboard
      console.log('Metrics updated:', data)
    })
  }

  return {
    isConnected,
    connectionError,
    notifications,
    markNotificationAsRead,
    clearNotifications
  }
}

export default useRealTime