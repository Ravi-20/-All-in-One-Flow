'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProductionStore } from '@/stores/production'
import { useInventoryStore } from '@/stores/inventory'
import { ProductionOrder, Material } from '@/types'
import { 
  Factory, 
  Package, 
  Plus, 
  Save, 
  AlertCircle,
  CheckCircle,
  Loader2 
} from 'lucide-react'

export function ManualDataEntry() {
  const productionStore = useProductionStore()
  const inventoryStore = useInventoryStore()
  
  const [activeTab, setActiveTab] = useState<'production' | 'inventory' | 'stock'>('production')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastAdded, setLastAdded] = useState<{ type: string, name: string } | null>(null)

  // Production Order Form State
  const [productionForm, setProductionForm] = useState({
    orderNumber: '',
    productName: '',
    productCode: '',
    quantity: '',
    priority: 'medium' as const,
    dueDate: ''
  })

  // Material Form State
  const [materialForm, setMaterialForm] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Raw Materials',
    unit: 'pcs',
    currentStock: '',
    minimumStock: '',
    maximumStock: '',
    unitCost: '',
    supplier: '',
    location: ''
  })

  // Stock Movement Form State
  const [stockForm, setStockForm] = useState({
    materialId: '',
    type: 'in' as const,
    quantity: '',
    reason: ''
  })

  const resetProductionForm = () => {
    setProductionForm({
      orderNumber: '',
      productName: '',
      productCode: '',
      quantity: '',
      priority: 'medium',
      dueDate: ''
    })
  }

  const resetMaterialForm = () => {
    setMaterialForm({
      code: '',
      name: '',
      description: '',
      category: 'Raw Materials',
      unit: 'pcs',
      currentStock: '',
      minimumStock: '',
      maximumStock: '',
      unitCost: '',
      supplier: '',
      location: ''
    })
  }

  const resetStockForm = () => {
    setStockForm({
      materialId: '',
      type: 'in',
      quantity: '',
      reason: ''
    })
  }

  const handleProductionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newOrder: ProductionOrder = {
        id: Math.random().toString(36).substr(2, 9),
        orderNumber: productionForm.orderNumber || `PO-${Date.now()}`,
        productName: productionForm.productName,
        productCode: productionForm.productCode || `PRD-${Math.floor(Math.random() * 1000)}`,
        quantity: parseInt(productionForm.quantity) || 1,
        status: 'scheduled',
        priority: productionForm.priority,
        startDate: new Date(),
        dueDate: productionForm.dueDate ? new Date(productionForm.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        progress: 0,
        workOrders: [],
        materials: [],
        estimatedCost: Math.floor(Math.random() * 10000) + 5000,
        actualCost: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      productionStore.addOrder(newOrder)
      setLastAdded({ type: 'Production Order', name: newOrder.orderNumber })
      resetProductionForm()
    } catch (error) {
      console.error('Error adding production order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newMaterial: Material = {
        id: Math.random().toString(36).substr(2, 9),
        code: materialForm.code || `MAT-${Date.now()}`,
        name: materialForm.name,
        description: materialForm.description,
        category: materialForm.category,
        unit: materialForm.unit,
        currentStock: parseFloat(materialForm.currentStock) || 0,
        minimumStock: parseFloat(materialForm.minimumStock) || 10,
        maximumStock: parseFloat(materialForm.maximumStock) || 1000,
        unitCost: parseFloat(materialForm.unitCost) || 0,
        supplier: materialForm.supplier,
        location: materialForm.location,
        lastUpdated: new Date()
      }

      inventoryStore.addMaterial(newMaterial)
      setLastAdded({ type: 'Material', name: newMaterial.name })
      resetMaterialForm()
    } catch (error) {
      console.error('Error adding material:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStockMovement = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const materials = inventoryStore.materials
      const material = materials.find(m => m.id === stockForm.materialId)
      
      if (!material) {
        alert('Please select a valid material')
        setIsSubmitting(false)
        return
      }

      inventoryStore.updateStock(
        stockForm.materialId,
        parseFloat(stockForm.quantity),
        stockForm.type,
        stockForm.reason || `Manual ${stockForm.type === 'in' ? 'receipt' : 'consumption'}`
      )

      setLastAdded({ 
        type: 'Stock Movement', 
        name: `${stockForm.type.toUpperCase()} ${stockForm.quantity} ${material.unit} of ${material.name}` 
      })
      resetStockForm()
    } catch (error) {
      console.error('Error processing stock movement:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Manual Data Entry</h2>
        <p className="text-muted-foreground">Add data manually and watch real-time updates across all pages</p>
      </div>

      {/* Success Message */}
      {lastAdded && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800">
                <strong>{lastAdded.type}</strong> "{lastAdded.name}" added successfully! 
                Check other pages to see real-time updates.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        <button
          onClick={() => setActiveTab('production')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'production'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Factory className="inline h-4 w-4 mr-2" />
          Production Order
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Package className="inline h-4 w-4 mr-2" />
          Add Material
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'stock'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Plus className="inline h-4 w-4 mr-2" />
          Stock Movement
        </button>
      </div>

      {/* Production Order Form */}
      {activeTab === 'production' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Factory className="h-5 w-5" />
              <span>Add Production Order</span>
            </CardTitle>
            <CardDescription>
              Create a new production order that will appear instantly on the Production page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProductionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Order Number (optional)</label>
                  <Input
                    value={productionForm.orderNumber}
                    onChange={(e) => setProductionForm(prev => ({ ...prev, orderNumber: e.target.value }))}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Code (optional)</label>
                  <Input
                    value={productionForm.productCode}
                    onChange={(e) => setProductionForm(prev => ({ ...prev, productCode: e.target.value }))}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <Input
                  required
                  value={productionForm.productName}
                  onChange={(e) => setProductionForm(prev => ({ ...prev, productName: e.target.value }))}
                  placeholder="e.g., Advanced Widget Assembly"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity *</label>
                  <Input
                    type="number"
                    required
                    min="1"
                    value={productionForm.quantity}
                    onChange={(e) => setProductionForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={productionForm.priority}
                    onChange={(e) => setProductionForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={productionForm.dueDate}
                    onChange={(e) => setProductionForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Production Order...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Production Order
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Material Form */}
      {activeTab === 'inventory' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Add Material</span>
            </CardTitle>
            <CardDescription>
              Add a new material that will appear instantly on the Inventory page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMaterialSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Material Code (optional)</label>
                  <Input
                    value={materialForm.code}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Material Name *</label>
                  <Input
                    required
                    value={materialForm.name}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Steel Sheet 3mm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the material"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={materialForm.category}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Components">Components</option>
                    <option value="Fasteners">Fasteners</option>
                    <option value="Tools">Tools</option>
                    <option value="Consumables">Consumables</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <select
                    value={materialForm.unit}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="meters">Meters</option>
                    <option value="sheets">Sheets</option>
                    <option value="liters">Liters</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit Cost *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={materialForm.unitCost}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, unitCost: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Stock</label>
                  <Input
                    type="number"
                    min="0"
                    value={materialForm.currentStock}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, currentStock: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Stock</label>
                  <Input
                    type="number"
                    min="0"
                    value={materialForm.minimumStock}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, minimumStock: e.target.value }))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Maximum Stock</label>
                  <Input
                    type="number"
                    min="0"
                    value={materialForm.maximumStock}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, maximumStock: e.target.value }))}
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Supplier</label>
                  <Input
                    value={materialForm.supplier}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder="Supplier name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={materialForm.location}
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Warehouse A-1"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Material...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Material
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stock Movement Form */}
      {activeTab === 'stock' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Stock Movement</span>
            </CardTitle>
            <CardDescription>
              Add or remove stock and watch real-time updates on Inventory and Analytics pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryStore.materials.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                <p className="text-muted-foreground">No materials available. Please add a material first.</p>
              </div>
            ) : (
              <form onSubmit={handleStockMovement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Material *</label>
                  <select
                    required
                    value={stockForm.materialId}
                    onChange={(e) => setStockForm(prev => ({ ...prev, materialId: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Choose a material...</option>
                    {inventoryStore.materials.map(material => (
                      <option key={material.id} value={material.id}>
                        {material.name} ({material.code}) - Current: {material.currentStock} {material.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Movement Type</label>
                    <select
                      value={stockForm.type}
                      onChange={(e) => setStockForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="in">Stock In (Receipt)</option>
                      <option value="out">Stock Out (Consumption)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity *</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={stockForm.quantity}
                      onChange={(e) => setStockForm(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reason</label>
                    <Input
                      value={stockForm.reason}
                      onChange={(e) => setStockForm(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="e.g., Purchase receipt, Production use"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Movement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Process Stock Movement
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-blue-800">
              <h4 className="font-medium mb-2">Real-Time Testing Instructions:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Add data using the forms above</li>
                <li>Open multiple tabs/windows of the application</li>
                <li>Navigate to Production, Inventory, Quality, or Analytics pages</li>
                <li>Watch your data appear instantly across all pages</li>
                <li>Check the notification bell for real-time alerts</li>
                <li>Connection status indicator shows real-time sync status</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ManualDataEntry