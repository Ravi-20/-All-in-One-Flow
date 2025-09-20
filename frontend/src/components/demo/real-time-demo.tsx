'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductionStore } from '@/stores/production'
import { useInventoryStore } from '@/stores/inventory'
import { ProductionOrder, Material } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Factory, Package, Plus, Edit, Trash2 } from 'lucide-react'

export function RealTimeDemo() {
  const productionStore = useProductionStore()
  const inventoryStore = useInventoryStore()
  const [isSimulating, setIsSimulating] = useState(false)

  // Demo production order creation
  const createDemoProductionOrder = () => {
    const orderNumber = `PO-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    const productNames = [
      'Advanced Widget Assembly',
      'Precision Gear Unit',
      'Industrial Control Module',
      'High-Performance Bearing',
      'Custom Valve Assembly'
    ]
    
    const newOrder: ProductionOrder = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber,
      productName: productNames[Math.floor(Math.random() * productNames.length)],
      productCode: `PRD-${Math.floor(Math.random() * 1000)}`,
      quantity: Math.floor(Math.random() * 200) + 50,
      status: 'scheduled',
      priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as any,
      startDate: new Date(),
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within 30 days
      progress: 0,
      workOrders: [],
      materials: [],
      estimatedCost: Math.floor(Math.random() * 20000) + 5000,
      actualCost: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    productionStore.addOrder(newOrder)
  }

  // Demo inventory material creation
  const createDemoMaterial = () => {
    const materialNames = [
      'Titanium Alloy Sheet',
      'Carbon Fiber Rod',
      'Precision Ball Bearings',
      'Industrial Grade Steel',
      'High-Temperature Polymer'
    ]
    
    const newMaterial: Material = {
      id: Math.random().toString(36).substr(2, 9),
      code: `MAT-${Math.floor(Math.random() * 1000)}`,
      name: materialNames[Math.floor(Math.random() * materialNames.length)],
      description: 'Demo material for testing real-time updates',
      category: ['Raw Materials', 'Components', 'Fasteners'][Math.floor(Math.random() * 3)],
      unit: ['kg', 'pcs', 'meters', 'sheets'][Math.floor(Math.random() * 4)],
      currentStock: Math.floor(Math.random() * 500) + 100,
      minimumStock: 50,
      maximumStock: 1000,
      unitCost: Math.random() * 100 + 10,
      supplier: 'Demo Supplier Co.',
      location: `Warehouse ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}-${Math.floor(Math.random() * 5) + 1}`,
      lastUpdated: new Date()
    }
    
    inventoryStore.addMaterial(newMaterial)
  }

  // Demo stock movement
  const createStockMovement = () => {
    const materials = inventoryStore.materials
    if (materials.length === 0) return
    
    const randomMaterial = materials[Math.floor(Math.random() * materials.length)]
    const isInbound = Math.random() > 0.5
    const quantity = Math.floor(Math.random() * 50) + 10
    
    inventoryStore.updateStock(
      randomMaterial.id,
      quantity,
      isInbound ? 'in' : 'out',
      isInbound ? 'Purchase receipt' : 'Production consumption'
    )
  }

  // Update existing production order
  const updateRandomProductionOrder = () => {
    const orders = productionStore.orders
    if (orders.length === 0) return
    
    const randomOrder = orders[Math.floor(Math.random() * orders.length)]
    const newProgress = Math.min(100, randomOrder.progress + Math.floor(Math.random() * 25) + 5)
    const newStatus = newProgress === 100 ? 'completed' : 
                     newProgress > 0 ? 'in_progress' : 'scheduled'
    
    productionStore.updateOrder(randomOrder.id, {
      progress: newProgress,
      status: newStatus,
      ...(newStatus === 'completed' && { completedDate: new Date() })
    })
  }

  // Start simulation
  const startSimulation = () => {
    setIsSimulating(true)
    
    const interval = setInterval(() => {
      const actions = [
        createDemoProductionOrder,
        createDemoMaterial,
        createStockMovement,
        updateRandomProductionOrder
      ]
      
      // Execute random action
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      randomAction()
      
    }, 3000) // Execute every 3 seconds
    
    // Stop after 30 seconds
    setTimeout(() => {
      clearInterval(interval)
      setIsSimulating(false)
    }, 30000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🔴 Real-Time Demo</span>
          {isSimulating && (
            <Badge variant="success" className="animate-pulse">
              LIVE
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Test real-time data updates across all pages. Create, update, and modify data to see instant updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={createDemoProductionOrder}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <Factory className="h-4 w-4" />
            <span>Add Production Order</span>
          </Button>
          
          <Button
            onClick={createDemoMaterial}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <Package className="h-4 w-4" />
            <span>Add Material</span>
          </Button>
          
          <Button
            onClick={createStockMovement}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <Edit className="h-4 w-4" />
            <span>Stock Movement</span>
          </Button>
          
          <Button
            onClick={updateRandomProductionOrder}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <Edit className="h-4 w-4" />
            <span>Update Order</span>
          </Button>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button
            onClick={startSimulation}
            disabled={isSimulating}
            className="flex items-center space-x-2"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            <span>
              {isSimulating ? 'Simulation Running...' : 'Start 30s Simulation'}
            </span>
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground text-center space-y-1">
          <p>• Navigate between Dashboard, Production, Inventory, Quality, and Analytics</p>
          <p>• Watch data update in real-time across all pages</p>
          <p>• Check the notification bell for live updates</p>
          <p>• Connection status indicator shows real-time sync status</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default RealTimeDemo