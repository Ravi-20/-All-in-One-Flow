'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useInventoryStore } from '@/stores/inventory'
import { formatCurrency, formatDate } from '@/lib/utils'
import RealTimeIndicator from '@/components/demo/real-time-indicator'

export default function InventoryPage() {
  const { materials, stockMovements, initializeMockData } = useInventoryStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (material: typeof materials[0]) => {
    if (material.currentStock <= material.minimumStock) {
      return { status: 'Low Stock', variant: 'destructive' as const }
    }
    if (material.currentStock >= material.maximumStock) {
      return { status: 'Overstock', variant: 'warning' as const }
    }
    return { status: 'Normal', variant: 'success' as const }
  }

  const categories = Array.from(new Set(materials.map(m => m.category)))
  const totalValue = materials.reduce((sum, m) => sum + (m.currentStock * m.unitCost), 0)
  const lowStockCount = materials.filter(m => m.currentStock <= m.minimumStock).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your materials and stock levels</p>
        </div>
        <div className="flex items-center space-x-4">
          <RealTimeIndicator />
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Materials Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Materials</CardTitle>
              <CardDescription>
                {filteredMaterials.length} of {materials.length} materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min/Max</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => {
                    const stockStatus = getStockStatus(material)
                    return (
                      <TableRow key={material.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{material.name}</div>
                            <div className="text-sm text-muted-foreground">{material.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>{material.category}</TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{material.currentStock}</span>
                            <span className="text-sm text-muted-foreground ml-1">{material.unit}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Min: {material.minimumStock}</div>
                            <div>Max: {material.maximumStock}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(material.unitCost)}</TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Stock Movements */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
              <CardDescription>Latest inventory transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockMovements.slice(0, 10).map((movement) => {
                  const material = materials.find(m => m.id === movement.materialId)
                  return (
                    <div key={movement.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{material?.name || 'Unknown Material'}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {movement.reason}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(movement.timestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}