'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Download,
  ArrowUp,
  ArrowDown,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  FileText,
  MapPin
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useInventoryStore } from '@/stores/inventory'
import { formatDate, formatCurrency, formatDateTime } from '@/lib/utils'
import { StockLedgerEntry } from '@/types'

// Mock stock ledger entries
const mockStockLedgerEntries: StockLedgerEntry[] = [
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
    movementType: 'in',
    quantity: 500,
    unitCost: 5.50,
    totalValue: 2750,
    balanceAfter: 950,
    reference: 'PO-2024-001',
    reason: 'Purchase Order Receipt',
    location: 'Warehouse A',
    timestamp: new Date('2024-01-20T08:30:00'),
    user: 'John Smith'
  },
  {
    id: '2',
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
    movementType: 'out',
    quantity: 50,
    unitCost: 5.50,
    totalValue: 275,
    balanceAfter: 900,
    reference: 'WO-001',
    reason: 'Production Consumption',
    location: 'Production Floor',
    timestamp: new Date('2024-01-21T10:15:00'),
    user: 'Jane Doe'
  },
  {
    id: '3',
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
    movementType: 'in',
    quantity: 200,
    unitCost: 8.75,
    totalValue: 1750,
    balanceAfter: 450,
    reference: 'PO-2024-002',
    reason: 'Purchase Order Receipt',
    location: 'Warehouse B',
    timestamp: new Date('2024-01-22T14:20:00'),
    user: 'Mike Johnson'
  },
  {
    id: '4',
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
    movementType: 'adjustment',
    quantity: -25,
    unitCost: 5.50,
    totalValue: -137.50,
    balanceAfter: 875,
    reference: 'ADJ-001',
    reason: 'Physical Count Adjustment',
    location: 'Warehouse A',
    timestamp: new Date('2024-01-23T16:45:00'),
    user: 'Lisa Anderson'
  },
  {
    id: '5',
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
    movementType: 'out',
    quantity: 5,
    unitCost: 150.00,
    totalValue: 750,
    balanceAfter: 20,
    reference: 'WO-002',
    reason: 'Assembly Production',
    location: 'Assembly Line 1',
    timestamp: new Date('2024-01-24T09:30:00'),
    user: 'Tom Brown'
  },
  {
    id: '6',
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
    movementType: 'transfer',
    quantity: 100,
    unitCost: 8.75,
    totalValue: 875,
    balanceAfter: 350,
    reference: 'TRF-001',
    reason: 'Transfer to Production Floor',
    location: 'Production Floor',
    timestamp: new Date('2024-01-25T11:00:00'),
    user: 'Sarah Wilson'
  }
]

export default function StockLedgerPage() {
  const { materials, initializeMockData } = useInventoryStore()
  const [entries] = useState<StockLedgerEntry[]>(mockStockLedgerEntries)
  const [searchTerm, setSearchTerm] = useState('')
  const [movementFilter, setMovementFilter] = useState<'all' | 'in' | 'out' | 'adjustment' | 'transfer'>('all')

  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])

  // Filter entries based on search and movement type
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesMovement = movementFilter === 'all' || entry.movementType === movementFilter
    
    return matchesSearch && matchesMovement
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getMovementIcon = (type: StockLedgerEntry['movementType']) => {
    switch (type) {
      case 'in':
        return ArrowUp
      case 'out':
        return ArrowDown
      case 'adjustment':
        return FileText
      case 'transfer':
        return Package
      default:
        return Package
    }
  }

  const getMovementColor = (type: StockLedgerEntry['movementType']) => {
    switch (type) {
      case 'in':
        return 'text-green-600'
      case 'out':
        return 'text-red-600'
      case 'adjustment':
        return 'text-blue-600'
      case 'transfer':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const getMovementBadgeVariant = (type: StockLedgerEntry['movementType']) => {
    switch (type) {
      case 'in':
        return 'success'
      case 'out':
        return 'destructive'
      case 'adjustment':
        return 'info'
      case 'transfer':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const movementCounts = {
    all: entries.length,
    in: entries.filter(e => e.movementType === 'in').length,
    out: entries.filter(e => e.movementType === 'out').length,
    adjustment: entries.filter(e => e.movementType === 'adjustment').length,
    transfer: entries.filter(e => e.movementType === 'transfer').length
  }

  const totalInValue = entries
    .filter(e => e.movementType === 'in')
    .reduce((sum, e) => sum + e.totalValue, 0)
  
  const totalOutValue = entries
    .filter(e => e.movementType === 'out')
    .reduce((sum, e) => sum + Math.abs(e.totalValue), 0)

  const netValue = totalInValue - totalOutValue

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Ledger</h1>
          <p className="text-muted-foreground">Track material movement and inventory balance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inbound Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalInValue)}</div>
            <p className="text-xs text-muted-foreground">
              {movementCounts.in} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outbound Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalOutValue)}</div>
            <p className="text-xs text-muted-foreground">
              {movementCounts.out} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Value</CardTitle>
            <TrendingUp className={`h-4 w-4 ${netValue >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Net movement value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Ledger Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>
                {filteredEntries.length} of {entries.length} movements
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search movements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'in', 'out', 'adjustment', 'transfer'] as const).map((movement) => (
              <Button
                key={movement}
                variant={movementFilter === movement ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMovementFilter(movement)}
                className="flex items-center space-x-2"
              >
                <span className="capitalize">{movement === 'all' ? 'All Movements' : movement}</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-1 ${movementFilter === movement ? 'bg-white text-black' : ''}`}
                >
                  {movementCounts[movement]}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Movements Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Movement</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No stock movements found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => {
                    const MovementIcon = getMovementIcon(entry.movementType)
                    
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div>{formatDate(entry.timestamp)}</div>
                              <div className="text-muted-foreground">
                                {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.material.name}</div>
                            <div className="text-sm text-muted-foreground">{entry.material.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MovementIcon className={`h-4 w-4 ${getMovementColor(entry.movementType)}`} />
                            <Badge variant={getMovementBadgeVariant(entry.movementType)}>
                              {entry.movementType.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={entry.quantity < 0 ? 'text-red-600' : 'text-green-600'}>
                            {entry.quantity > 0 ? '+' : ''}{entry.quantity} {entry.material.unit}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={entry.totalValue < 0 ? 'text-red-600' : 'text-green-600'}>
                            {formatCurrency(entry.totalValue)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {entry.balanceAfter} {entry.material.unit}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.reference}</div>
                            <div className="text-sm text-muted-foreground">{entry.reason}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{entry.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{entry.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}