'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Copy,
  Download,
  FileText,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Hash,
  Layers
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { BillOfMaterial, BOMItem } from '@/types'

// Mock BOM data
const mockBOMs: BillOfMaterial[] = [
  {
    id: '1',
    productCode: 'SWA-001',
    productName: 'Steel Widget Assembly',
    version: 'v1.2',
    description: 'Complete steel widget with electronic controls',
    status: 'active',
    items: [
      {
        id: '1',
        materialId: '1',
        material: {
          id: '1',
          code: 'STL-001',
          name: 'Steel Sheet 2mm',
          description: 'Cold rolled steel sheet',
          category: 'Raw Materials',
          unit: 'kg',
          currentStock: 450,
          minimumStock: 100,
          maximumStock: 1000,
          unitCost: 5.50,
          supplier: 'Steel Corp Ltd',
          location: 'Warehouse A',
          lastUpdated: new Date()
        },
        quantity: 2.5,
        unit: 'kg',
        wastagePercentage: 5,
        cost: 13.75,
        isOptional: false
      },
      {
        id: '2',
        materialId: '3',
        material: {
          id: '3',
          code: 'ELE-003',
          name: 'Electric Motor 1HP',
          description: 'Single phase electric motor',
          category: 'Components',
          unit: 'pcs',
          currentStock: 25,
          minimumStock: 10,
          maximumStock: 50,
          unitCost: 150.00,
          supplier: 'Electric Motors Co',
          location: 'Component Storage',
          lastUpdated: new Date()
        },
        quantity: 1,
        unit: 'pcs',
        wastagePercentage: 0,
        cost: 150.00,
        isOptional: false
      },
      {
        id: '3',
        materialId: '4',
        material: {
          id: '4',
          code: 'BOL-004',
          name: 'Hex Bolt M8x20',
          description: 'Stainless steel hex bolt',
          category: 'Fasteners',
          unit: 'pcs',
          currentStock: 1000,
          minimumStock: 200,
          maximumStock: 2000,
          unitCost: 0.25,
          supplier: 'Fastener Solutions',
          location: 'Hardware Storage',
          lastUpdated: new Date()
        },
        quantity: 8,
        unit: 'pcs',
        wastagePercentage: 2,
        cost: 2.00,
        isOptional: false
      }
    ],
    totalCost: 165.75,
    laborCost: 25.00,
    overheadCost: 15.50,
    createdBy: 'Engineering Team',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    productCode: 'AH-002',
    productName: 'Aluminum Housing',
    version: 'v2.0',
    description: 'Precision machined aluminum housing',
    status: 'active',
    items: [
      {
        id: '4',
        materialId: '2',
        material: {
          id: '2',
          code: 'ALU-002',
          name: 'Aluminum Rod 10mm',
          description: 'Aluminum alloy rod',
          category: 'Raw Materials',
          unit: 'm',
          currentStock: 250,
          minimumStock: 50,
          maximumStock: 500,
          unitCost: 8.75,
          supplier: 'Metal Solutions Inc',
          location: 'Warehouse B',
          lastUpdated: new Date()
        },
        quantity: 0.5,
        unit: 'm',
        wastagePercentage: 10,
        cost: 4.38,
        isOptional: false
      },
      {
        id: '5',
        materialId: '5',
        material: {
          id: '5',
          code: 'GAS-005',
          name: 'O-Ring Seal 25mm',
          description: 'Rubber O-ring seal',
          category: 'Seals',
          unit: 'pcs',
          currentStock: 500,
          minimumStock: 100,
          maximumStock: 1000,
          unitCost: 1.50,
          supplier: 'Seal Tech Ltd',
          location: 'Component Storage',
          lastUpdated: new Date()
        },
        quantity: 2,
        unit: 'pcs',
        wastagePercentage: 0,
        cost: 3.00,
        isOptional: false
      }
    ],
    totalCost: 7.38,
    laborCost: 12.00,
    overheadCost: 3.50,
    createdBy: 'Design Team',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    productCode: 'ECP-003',
    productName: 'Electronic Control Panel',
    version: 'v1.0',
    description: 'Digital control panel with LCD display',
    status: 'draft',
    items: [
      {
        id: '6',
        materialId: '6',
        material: {
          id: '6',
          code: 'PCB-006',
          name: 'Control PCB Board',
          description: 'Custom control circuit board',
          category: 'Electronics',
          unit: 'pcs',
          currentStock: 50,
          minimumStock: 20,
          maximumStock: 100,
          unitCost: 45.00,
          supplier: 'Electronics Corp',
          location: 'Electronics Storage',
          lastUpdated: new Date()
        },
        quantity: 1,
        unit: 'pcs',
        wastagePercentage: 0,
        cost: 45.00,
        isOptional: false
      },
      {
        id: '7',
        materialId: '7',
        material: {
          id: '7',
          code: 'LCD-007',
          name: 'LCD Display 4x20',
          description: '4 line 20 character LCD display',
          category: 'Electronics',
          unit: 'pcs',
          currentStock: 30,
          minimumStock: 10,
          maximumStock: 60,
          unitCost: 25.00,
          supplier: 'Display Solutions',
          location: 'Electronics Storage',
          lastUpdated: new Date()
        },
        quantity: 1,
        unit: 'pcs',
        wastagePercentage: 0,
        cost: 25.00,
        isOptional: false
      }
    ],
    totalCost: 70.00,
    laborCost: 35.00,
    overheadCost: 12.00,
    createdBy: 'Electronics Team',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  }
]

export default function BOMPage() {
  const [boms] = useState<BillOfMaterial[]>(mockBOMs)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'obsolete'>('all')
  const [selectedBOM, setSelectedBOM] = useState<BillOfMaterial | null>(null)

  // Filter BOMs based on search and status
  const filteredBOMs = boms.filter(bom => {
    const matchesSearch = !searchTerm || 
      bom.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || bom.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: BillOfMaterial['status']) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'draft':
        return 'warning'
      case 'obsolete':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status: BillOfMaterial['status']) => {
    switch (status) {
      case 'active':
        return CheckCircle
      case 'draft':
        return Clock
      case 'obsolete':
        return AlertTriangle
      default:
        return FileText
    }
  }

  const statusCounts = {
    all: boms.length,
    active: boms.filter(b => b.status === 'active').length,
    draft: boms.filter(b => b.status === 'draft').length,
    obsolete: boms.filter(b => b.status === 'obsolete').length
  }

  const totalBOMValue = boms.reduce((sum, bom) => sum + bom.totalCost + bom.laborCost + bom.overheadCost, 0)
  const activeBOMs = boms.filter(b => b.status === 'active')
  const averageCost = activeBOMs.length > 0 ? 
    activeBOMs.reduce((sum, bom) => sum + bom.totalCost + bom.laborCost + bom.overheadCost, 0) / activeBOMs.length : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills of Material (BOM)</h1>
          <p className="text-muted-foreground">Define material requirements per finished good</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New BOM
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total BOMs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boms.length}</div>
            <p className="text-xs text-muted-foreground">
              {statusCounts.active} active, {statusCounts.draft} draft
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total BOM Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBOMValue)}</div>
            <p className="text-xs text-muted-foreground">
              All BOMs combined
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageCost)}</div>
            <p className="text-xs text-muted-foreground">
              Per active BOM
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Materials</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.from(new Set(boms.flatMap(bom => bom.items.map(item => item.materialId)))).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all BOMs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* BOMs List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bills of Material</CardTitle>
                <CardDescription>
                  {filteredBOMs.length} of {boms.length} BOMs
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search BOMs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(['all', 'active', 'draft', 'obsolete'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="flex items-center space-x-2"
                >
                  <span className="capitalize">{status}</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 ${statusFilter === status ? 'bg-white text-black' : ''}`}
                  >
                    {statusCounts[status]}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* BOMs List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredBOMs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No BOMs found matching your criteria
                </div>
              ) : (
                filteredBOMs.map((bom) => {
                  const StatusIcon = getStatusIcon(bom.status)
                  const totalCost = bom.totalCost + bom.laborCost + bom.overheadCost
                  
                  return (
                    <div 
                      key={bom.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                        selectedBOM?.id === bom.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedBOM(bom)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-medium">{bom.productName}</h3>
                            <Badge variant={getStatusBadgeVariant(bom.status)}>
                              {bom.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {bom.productCode} - {bom.version}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {bom.items.length} items • {formatCurrency(totalCost)}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* BOM Details */}
        <Card>
          <CardHeader>
            <CardTitle>BOM Details</CardTitle>
            <CardDescription>
              {selectedBOM ? `${selectedBOM.productName} - ${selectedBOM.version}` : 'Select a BOM to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedBOM ? (
              <div className="space-y-6">
                {/* BOM Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{selectedBOM.productName}</h3>
                    <Badge variant={getStatusBadgeVariant(selectedBOM.status)}>
                      {selectedBOM.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedBOM.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Code: {selectedBOM.productCode}</span>
                    <span>Version: {selectedBOM.version}</span>
                    <span>Created by: {selectedBOM.createdBy}</span>
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Material Cost</div>
                    <div className="text-lg font-medium">{formatCurrency(selectedBOM.totalCost)}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Labor Cost</div>
                    <div className="text-lg font-medium">{formatCurrency(selectedBOM.laborCost)}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Overhead</div>
                    <div className="text-lg font-medium">{formatCurrency(selectedBOM.overheadCost)}</div>
                  </div>
                </div>

                {/* BOM Items */}
                <div>
                  <h4 className="font-medium mb-3">Materials Required</h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Waste</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBOM.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.material.name}</div>
                                <div className="text-sm text-muted-foreground">{item.material.code}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.quantity} {item.unit}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(item.cost)}
                            </TableCell>
                            <TableCell>
                              {item.wastagePercentage > 0 && (
                                <span className="text-yellow-600">{item.wastagePercentage}%</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Total Cost */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-medium">
                    <span>Total Product Cost</span>
                    <span>{formatCurrency(selectedBOM.totalCost + selectedBOM.laborCost + selectedBOM.overheadCost)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a BOM from the list to view its details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}