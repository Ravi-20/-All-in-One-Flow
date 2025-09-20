'use client'

import { io, Socket } from 'socket.io-client'
import { ProductionOrder, Material, QualityCheck, WorkOrder, StockMovement } from '@/types'

interface SocketEvents {
  // Production events
  'production-updated': (data: { type: 'created' | 'updated' | 'deleted', order: ProductionOrder }) => void
  'work-order-updated': (data: { type: 'created' | 'updated' | 'completed', workOrder: WorkOrder, productionOrderId: string }) => void
  
  // Inventory events
  'inventory-updated': (data: { type: 'created' | 'updated' | 'deleted', material: Material }) => void
  'stock-movement': (data: { movement: StockMovement, material: Material }) => void
  
  // Quality events
  'quality-updated': (data: { type: 'created' | 'updated', qualityCheck: QualityCheck, workOrderId: string }) => void
  
  // Real-time metrics
  'metrics-updated': (data: { 
    type: 'production' | 'inventory' | 'quality' | 'analytics'
    metrics: any
  }) => void
  
  // System notifications
  'notification': (data: {
    type: 'info' | 'warning' | 'error' | 'success'
    title: string
    message: string
    timestamp: Date
  }) => void
  
  // User connection events
  'user-connected': (data: { userId: string, username: string }) => void
  'user-disconnected': (data: { userId: string, username: string }) => void
}

class SocketService {
  private socket: Socket | null = null
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect(token: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        
        this.socket = io(API_BASE_URL, {
          auth: {
            token,
            userId
          },
          transports: ['websocket', 'polling'],
          timeout: 20000,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: this.maxReconnectAttempts
        })

        this.socket.on('connect', () => {
          console.log('✅ Socket connected successfully')
          this.isConnected = true
          this.reconnectAttempts = 0
          resolve()
        })

        this.socket.on('disconnect', (reason) => {
          console.log('❌ Socket disconnected:', reason)
          this.isConnected = false
        })

        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error)
          this.reconnectAttempts++
          
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            reject(new Error('Failed to connect to real-time server'))
          }
        })

        this.socket.on('reconnect', (attemptNumber) => {
          console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`)
          this.isConnected = true
        })

        // Set connection timeout
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('Socket connection timeout'))
          }
        }, 10000)

      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
      console.log('🔌 Socket disconnected manually')
    }
  }

  // Event subscription methods
  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): void {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off<K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]): void {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  // Event emission methods
  emit(event: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data)
    } else {
      console.warn('⚠️ Cannot emit event: Socket not connected')
    }
  }

  // Utility methods
  joinDepartment(department: string): void {
    this.emit('join-department', department)
  }

  // Production events
  emitProductionUpdate(order: ProductionOrder, type: 'created' | 'updated' | 'deleted'): void {
    this.emit('production-update', { type, order })
  }

  emitWorkOrderUpdate(workOrder: WorkOrder, productionOrderId: string, type: 'created' | 'updated' | 'completed'): void {
    this.emit('work-order-update', { type, workOrder, productionOrderId })
  }

  // Inventory events
  emitInventoryUpdate(material: Material, type: 'created' | 'updated' | 'deleted'): void {
    this.emit('inventory-update', { type, material })
  }

  emitStockMovement(movement: StockMovement, material: Material): void {
    this.emit('stock-movement', { movement, material })
  }

  // Quality events
  emitQualityUpdate(qualityCheck: QualityCheck, workOrderId: string, type: 'created' | 'updated'): void {
    this.emit('quality-update', { type, qualityCheck, workOrderId })
  }

  // Connection status
  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

// Singleton instance
export const socketService = new SocketService()
export default socketService