import { create } from 'zustand'
import { Material, StockMovement } from '@/types'
import socketService from '@/lib/socket'

interface InventoryState {
  materials: Material[]
  stockMovements: StockMovement[]
  selectedMaterial: Material | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setMaterials: (materials: Material[]) => void
  addMaterial: (material: Material) => void
  updateMaterial: (id: string, updates: Partial<Material>) => void
  deleteMaterial: (id: string) => void
  setSelectedMaterial: (material: Material | null) => void
  addStockMovement: (movement: StockMovement) => void
  updateStock: (materialId: string, quantity: number, type: 'in' | 'out', reason: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Mock data functions
  initializeMockData: () => void
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  materials: [],
  stockMovements: [],
  selectedMaterial: null,
  isLoading: false,
  error: null,

  setMaterials: (materials) => set({ materials }),
  
  addMaterial: (material) => {
    set((state) => ({
      materials: [...state.materials, material]
    }))
    // Emit real-time event
    socketService.emitInventoryUpdate(material, 'created')
  },
  
  updateMaterial: (id, updates) => {
    set((state) => {
      const updatedMaterial = state.materials.find(material => material.id === id)
      if (!updatedMaterial) return state
      
      const newMaterial = { ...updatedMaterial, ...updates, lastUpdated: new Date() }
      
      return {
        materials: state.materials.map(material => 
          material.id === id ? newMaterial : material
        ),
        selectedMaterial: state.selectedMaterial?.id === id 
          ? newMaterial
          : state.selectedMaterial
      }
    })
    
    // Emit real-time event
    const { materials } = get()
    const updatedMaterial = materials.find(material => material.id === id)
    if (updatedMaterial) {
      socketService.emitInventoryUpdate(updatedMaterial, 'updated')
    }
  },
  
  deleteMaterial: (id) => {
    const { materials } = get()
    const materialToDelete = materials.find(material => material.id === id)
    
    set((state) => ({
      materials: state.materials.filter(material => material.id !== id),
      selectedMaterial: state.selectedMaterial?.id === id ? null : state.selectedMaterial
    }))
    
    // Emit real-time event
    if (materialToDelete) {
      socketService.emitInventoryUpdate(materialToDelete, 'deleted')
    }
  },
  
  setSelectedMaterial: (material) => set({ selectedMaterial: material }),
  
  addStockMovement: (movement) => set((state) => ({
    stockMovements: [movement, ...state.stockMovements]
  })),
  
  updateStock: (materialId, quantity, type, reason) => {
    const movement: StockMovement = {
      id: Math.random().toString(36).substr(2, 9),
      materialId,
      type,
      quantity: Math.abs(quantity),
      reason,
      timestamp: new Date(),
      user: 'Current User' // In real app, this would come from auth
    }
    
    set((state) => {
      const updatedMaterials = state.materials.map(material => {
        if (material.id === materialId) {
          const newStock = type === 'in' 
            ? material.currentStock + Math.abs(quantity)
            : material.currentStock - Math.abs(quantity)
          
          return {
            ...material,
            currentStock: Math.max(0, newStock),
            lastUpdated: new Date()
          }
        }
        return material
      })
      
      return {
        materials: updatedMaterials,
        stockMovements: [movement, ...state.stockMovements],
        selectedMaterial: state.selectedMaterial?.id === materialId
          ? updatedMaterials.find(m => m.id === materialId) || null
          : state.selectedMaterial
      }
    })
    
    // Emit real-time events
    const { materials } = get()
    const updatedMaterial = materials.find(m => m.id === materialId)
    if (updatedMaterial) {
      socketService.emitStockMovement(movement, updatedMaterial)
      socketService.emitInventoryUpdate(updatedMaterial, 'updated')
    }
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  initializeMockData: () => {
    const mockMaterials: Material[] = [
      {
        id: '1',
        code: 'STL-001',
        name: 'Steel Rod 10mm',
        description: 'High-grade steel rod for machining',
        category: 'Raw Materials',
        unit: 'meters',
        currentStock: 150,
        minimumStock: 50,
        maximumStock: 500,
        unitCost: 12.50,
        supplier: 'Steel Corp Ltd',
        location: 'Warehouse A-1',
        lastUpdated: new Date('2024-01-15')
      },
      {
        id: '2',
        code: 'ALU-002',
        name: 'Aluminum Sheet 2mm',
        description: 'Aluminum sheet for housing manufacturing',
        category: 'Raw Materials',
        unit: 'sheets',
        currentStock: 25,
        minimumStock: 20,
        maximumStock: 100,
        unitCost: 45.00,
        supplier: 'Aluminum Works',
        location: 'Warehouse B-2',
        lastUpdated: new Date('2024-01-14')
      },
      {
        id: '3',
        code: 'BLT-003',
        name: 'M8 Bolts',
        description: 'Standard M8 bolts for assembly',
        category: 'Fasteners',
        unit: 'pieces',
        currentStock: 15,
        minimumStock: 50,
        maximumStock: 1000,
        unitCost: 0.25,
        supplier: 'Fastener Supply Co',
        location: 'Warehouse C-3',
        lastUpdated: new Date('2024-01-16')
      }
    ]
    
    const mockMovements: StockMovement[] = [
      {
        id: 'mov-1',
        materialId: '1',
        type: 'out',
        quantity: 20,
        reason: 'Production consumption - PO-2024-001',
        timestamp: new Date('2024-01-15T10:30:00'),
        user: 'John Smith'
      },
      {
        id: 'mov-2',
        materialId: '2',
        type: 'in',
        quantity: 50,
        reason: 'Stock replenishment',
        timestamp: new Date('2024-01-14T14:00:00'),
        user: 'Jane Doe'
      }
    ]
    
    set({ materials: mockMaterials, stockMovements: mockMovements })
  }
}))