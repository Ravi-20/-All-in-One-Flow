import { create } from 'zustand'
import { ProductionOrder, WorkOrder } from '@/types'
import socketService from '@/lib/socket'

interface ProductionState {
  orders: ProductionOrder[]
  selectedOrder: ProductionOrder | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setOrders: (orders: ProductionOrder[]) => void
  addOrder: (order: ProductionOrder) => void
  updateOrder: (id: string, updates: Partial<ProductionOrder>) => void
  deleteOrder: (id: string) => void
  setSelectedOrder: (order: ProductionOrder | null) => void
  updateWorkOrder: (orderId: string, workOrderId: string, updates: Partial<WorkOrder>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Mock data functions
  initializeMockData: () => void
}

export const useProductionStore = create<ProductionState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  
  addOrder: (order) => {
    set((state) => ({
      orders: [...state.orders, order]
    }))
    // Emit real-time event
    socketService.emitProductionUpdate(order, 'created')
  },
  
  updateOrder: (id, updates) => {
    set((state) => {
      const updatedOrder = state.orders.find(order => order.id === id)
      if (!updatedOrder) return state
      
      const newOrder = { ...updatedOrder, ...updates, updatedAt: new Date() }
      
      return {
        orders: state.orders.map(order => 
          order.id === id ? newOrder : order
        ),
        selectedOrder: state.selectedOrder?.id === id 
          ? newOrder
          : state.selectedOrder
      }
    })
    
    // Emit real-time event
    const { orders } = get()
    const updatedOrder = orders.find(order => order.id === id)
    if (updatedOrder) {
      socketService.emitProductionUpdate(updatedOrder, 'updated')
    }
  },
  
  deleteOrder: (id) => {
    const { orders } = get()
    const orderToDelete = orders.find(order => order.id === id)
    
    set((state) => ({
      orders: state.orders.filter(order => order.id !== id),
      selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder
    }))
    
    // Emit real-time event
    if (orderToDelete) {
      socketService.emitProductionUpdate(orderToDelete, 'deleted')
    }
  },
  
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  
  updateWorkOrder: (orderId, workOrderId, updates) => {
    set((state) => {
      const updatedWorkOrder = { ...updates }
      
      return {
        orders: state.orders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              workOrders: order.workOrders.map(wo => 
                wo.id === workOrderId ? { ...wo, ...updatedWorkOrder } : wo
              ),
              updatedAt: new Date()
            }
          }
          return order
        }),
        selectedOrder: state.selectedOrder?.id === orderId
          ? {
              ...state.selectedOrder,
              workOrders: state.selectedOrder.workOrders.map(wo => 
                wo.id === workOrderId ? { ...wo, ...updatedWorkOrder } : wo
              ),
              updatedAt: new Date()
            }
          : state.selectedOrder
      }
    })
    
    // Emit real-time event
    const { orders } = get()
    const order = orders.find(o => o.id === orderId)
    const workOrder = order?.workOrders.find(wo => wo.id === workOrderId)
    
    if (workOrder) {
      const eventType = workOrder.status === 'completed' ? 'completed' : 'updated'
      socketService.emitWorkOrderUpdate(workOrder, orderId, eventType)
    }
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  initializeMockData: () => {
    const mockOrders: ProductionOrder[] = [
      {
        id: '1',
        orderNumber: 'PO-2024-001',
        productName: 'Steel Widget Assembly',
        productCode: 'SWA-001',
        quantity: 100,
        status: 'in_progress',
        priority: 'high',
        startDate: new Date('2024-01-15'),
        dueDate: new Date('2024-01-25'),
        progress: 65,
        workOrders: [
          {
            id: 'wo-1',
            productionOrderId: '1',
            workstation: 'CNC-01',
            operation: 'Machining',
            sequence: 1,
            status: 'completed',
            estimatedDuration: 120,
            actualDuration: 115,
            startTime: new Date('2024-01-15T08:00:00'),
            endTime: new Date('2024-01-15T10:00:00'),
            assignedWorker: 'John Smith',
            qualityChecks: []
          },
          {
            id: 'wo-2',
            productionOrderId: '1',
            workstation: 'ASM-01',
            operation: 'Assembly',
            sequence: 2,
            status: 'in_progress',
            estimatedDuration: 180,
            startTime: new Date('2024-01-16T08:00:00'),
            assignedWorker: 'Jane Doe',
            qualityChecks: []
          }
        ],
        materials: [],
        estimatedCost: 5000,
        actualCost: 4800,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: '2',
        orderNumber: 'PO-2024-002',
        productName: 'Aluminum Housing',
        productCode: 'AH-002',
        quantity: 50,
        status: 'scheduled',
        priority: 'medium',
        startDate: new Date('2024-01-20'),
        dueDate: new Date('2024-01-30'),
        progress: 0,
        workOrders: [],
        materials: [],
        estimatedCost: 3000,
        actualCost: 0,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: '3',
        orderNumber: 'PO-2024-003',
        productName: 'Electronic Control Panel',
        productCode: 'ECP-003',
        quantity: 25,
        status: 'completed',
        priority: 'urgent',
        startDate: new Date('2024-01-05'),
        dueDate: new Date('2024-01-15'),
        completedDate: new Date('2024-01-14'),
        progress: 100,
        workOrders: [],
        materials: [],
        estimatedCost: 8000,
        actualCost: 7500,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: '4',
        orderNumber: 'PO-2024-004',
        productName: 'Hydraulic Cylinder',
        productCode: 'HC-004',
        quantity: 75,
        status: 'cancelled',
        priority: 'low',
        startDate: new Date('2024-01-25'),
        dueDate: new Date('2024-02-10'),
        progress: 0,
        workOrders: [],
        materials: [],
        estimatedCost: 4500,
        actualCost: 0,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '5',
        orderNumber: 'PO-2024-005',
        productName: 'Motor Drive Assembly',
        productCode: 'MDA-005',
        quantity: 200,
        status: 'draft',
        priority: 'medium',
        startDate: new Date('2024-02-01'),
        dueDate: new Date('2024-02-20'),
        progress: 0,
        workOrders: [],
        materials: [],
        estimatedCost: 12000,
        actualCost: 0,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22')
      },
      {
        id: '6',
        orderNumber: 'PO-2024-006',
        productName: 'Precision Gear Set',
        productCode: 'PGS-006',
        quantity: 150,
        status: 'in_progress',
        priority: 'high',
        startDate: new Date('2024-01-18'),
        dueDate: new Date('2024-01-28'),
        progress: 35,
        workOrders: [],
        materials: [],
        estimatedCost: 9000,
        actualCost: 3200,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-19')
      },
      {
        id: '7',
        orderNumber: 'PO-2024-007',
        productName: 'Safety Valve Unit',
        productCode: 'SVU-007',
        quantity: 80,
        status: 'completed',
        priority: 'urgent',
        startDate: new Date('2024-01-08'),
        dueDate: new Date('2024-01-18'),
        completedDate: new Date('2024-01-17'),
        progress: 100,
        workOrders: [],
        materials: [],
        estimatedCost: 6000,
        actualCost: 5800,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-17')
      },
      {
        id: '8',
        orderNumber: 'PO-2024-008',
        productName: 'Conveyor Belt System',
        productCode: 'CBS-008',
        quantity: 10,
        status: 'scheduled',
        priority: 'high',
        startDate: new Date('2024-02-05'),
        dueDate: new Date('2024-02-25'),
        progress: 0,
        workOrders: [],
        materials: [],
        estimatedCost: 15000,
        actualCost: 0,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ]
    
    set({ orders: mockOrders })
  }
}))