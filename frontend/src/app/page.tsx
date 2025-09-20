'use client'

import { useEffect, useState } from 'react'
import { 
  Factory, 
  Package, 
  ClipboardCheck, 
  TrendingUp,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/dashboard/stat-card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProductionStore } from '@/stores/production'
import { useInventoryStore } from '@/stores/inventory'
import { formatDate, formatCurrency } from '@/lib/utils'
import { ProductionOrder } from '@/types'
import ManualDataEntry from '@/components/forms/manual-data-entry'

type FilterState = 'all' | 'planned' | 'in_progress' | 'done' | 'canceled'

export default function Dashboard() {
  const { orders, initializeMockData: initProduction } = useProductionStore()
  const { materials, initializeMockData: initInventory } = useInventoryStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterState>('all')

  useEffect(() => {
    initProduction()
    initInventory()
  }, [])

  // Map internal status to user-friendly filter states
  const mapStatusToFilterState = (status: ProductionOrder['status']): FilterState => {
    switch (status) {
      case 'draft':
      case 'scheduled':
        return 'planned'
      case 'in_progress':
        return 'in_progress'
      case 'completed':
        return 'done'
      case 'cancelled':
        return 'canceled'
      default:
        return 'planned'
    }
  }

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || mapStatusToFilterState(order.status) === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate metrics
  const totalOrders = orders.length
  const plannedOrders = orders.filter(o => ['draft', 'scheduled'].includes(o.status)).length
  const inProgressOrders = orders.filter(o => o.status === 'in_progress').length
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const canceledOrders = orders.filter(o => o.status === 'cancelled').length
  const overDueOrders = orders.filter(o => new Date(o.dueDate) < new Date() && o.status !== 'completed').length
  
  const lowStockMaterials = materials.filter(m => m.currentStock <= m.minimumStock)
  const totalInventoryValue = materials.reduce((sum, m) => sum + (m.currentStock * m.unitCost), 0)
  
  const avgProgress = orders.length > 0 ? orders.reduce((sum, o) => sum + o.progress, 0) / orders.length : 0
  const onTimeRate = totalOrders > 0 ? ((totalOrders - overDueOrders) / totalOrders) * 100 : 100

  const getStatusBadgeVariant = (status: ProductionOrder['status']) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'info'
      case 'cancelled':
        return 'destructive'
      case 'scheduled':
        return 'warning'
      case 'draft':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getPriorityBadgeVariant = (priority: ProductionOrder['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'destructive'
      case 'high':
        return 'warning'
      case 'medium':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const getFilterLabel = (filter: FilterState) => {
    switch (filter) {
      case 'planned': return 'Planned'
      case 'in_progress': return 'In Progress'
      case 'done': return 'Done'
      case 'canceled': return 'Canceled'
      default: return 'All Orders'
    }
  }

  const getFilterCount = (filter: FilterState) => {
    switch (filter) {
      case 'planned': return plannedOrders
      case 'in_progress': return inProgressOrders
      case 'done': return completedOrders
      case 'canceled': return canceledOrders
      default: return totalOrders
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Manual Data Entry Section */}
      <ManualDataEntry />
      
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manufacturing Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage and track all your manufacturing orders</p>
        </div>
        <Button className="flex-shrink-0 h-10">
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="w-full">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={totalOrders}
            change={12}
            icon={Factory}
            format="number"
          />
          <StatCard
            title="In Progress"
            value={inProgressOrders}
            icon={Clock}
            format="number"
            progress={avgProgress}
          />
          <StatCard
            title="Inventory Value"
            value={totalInventoryValue}
            change={5.2}
            icon={Package}
            format="currency"
          />
          <StatCard
            title="On-Time Delivery"
            value={onTimeRate.toFixed(1)}
            change={2.1}
            icon={CheckCircle}
            format="percentage"
          />
        </div>
      </div>

      {/* Manufacturing Orders Section */}
      <div className="w-full">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-semibold text-foreground">Manufacturing Orders</CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                  {filteredOrders.length} of {totalOrders} orders
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 h-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            {/* Filter Buttons */}
            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
              <div className="flex flex-wrap gap-3">
                {(['all', 'planned', 'in_progress', 'done', 'canceled'] as FilterState[]).map((filter) => (
                  <Button
                    key={filter}
                    variant={statusFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(filter)}
                    className="flex items-center space-x-2 transition-all duration-200 h-9"
                  >
                    <span>{getFilterLabel(filter)}</span>
                    <Badge 
                      variant="secondary" 
                      className={`ml-1 transition-colors min-w-[1.5rem] justify-center ${statusFilter === filter ? 'bg-white text-black' : ''}`}
                    >
                      {getFilterCount(filter)}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-lg border border-border/50 bg-background overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="font-semibold text-foreground">Order Number</TableHead>
                    <TableHead className="font-semibold text-foreground">Product</TableHead>
                    <TableHead className="font-semibold text-foreground">Quantity</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Priority</TableHead>
                    <TableHead className="font-semibold text-foreground">Progress</TableHead>
                    <TableHead className="font-semibold text-foreground">Due Date</TableHead>
                    <TableHead className="font-semibold text-foreground">Cost</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-16 text-muted-foreground">
                        <div className="flex flex-col items-center space-y-3">
                          <Factory className="h-12 w-12 text-muted-foreground/40" />
                          <div>
                            <p className="text-lg font-medium">No orders found</p>
                            <p className="text-sm">Try adjusting your search criteria or filters</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.productName}</div>
                            <div className="text-sm text-muted-foreground">{order.productCode}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status === 'in_progress' ? 'In Progress' :
                             order.status === 'completed' ? 'Done' :
                             ['draft', 'scheduled'].includes(order.status) ? 'Planned' :
                             order.status === 'cancelled' ? 'Canceled' :
                             order.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(order.priority)}>
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-20">
                            <Progress value={order.progress} className="h-2" />
                            <span className="text-xs text-muted-foreground mt-1">{order.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatDate(order.dueDate)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(order.estimatedCost)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="w-full">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planned Orders</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plannedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Draft + Scheduled orders
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressOrders}</div>
              <p className="text-xs text-muted-foreground">
                Currently being manufactured
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canceled</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{canceledOrders}</div>
              <p className="text-xs text-muted-foreground">
                Canceled orders
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Insights */}
      {lowStockMaterials.length > 0 && (
        <div className="w-full">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>
                {lowStockMaterials.length} materials require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockMaterials.slice(0, 3).map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{material.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Current: {material.currentStock} {material.unit}
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning">Low Stock</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
