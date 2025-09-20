'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Square
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useProductionStore } from '@/stores/production'
import { formatDate, formatDuration } from '@/lib/utils'
import { WorkOrder } from '@/types'

type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold'

export default function WorkOrdersPage() {
  const { orders, initializeMockData } = useProductionStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all')

  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])

  // Flatten all work orders from all production orders
  const allWorkOrders = orders.flatMap(order => 
    order.workOrders.map(wo => ({
      ...wo,
      productionOrderNumber: order.orderNumber,
      productName: order.productName
    }))
  )

  // Filter work orders based on search and status
  const filteredWorkOrders = allWorkOrders.filter(workOrder => {
    const matchesSearch = !searchTerm || 
      workOrder.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.workstation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.productionOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.productName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || workOrder.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: WorkOrderStatus) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'info'
      case 'on_hold':
        return 'warning'
      case 'pending':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'in_progress':
        return Play
      case 'on_hold':
        return Pause
      case 'pending':
        return Clock
      default:
        return Clock
    }
  }

  const statusCounts = {
    all: allWorkOrders.length,
    pending: allWorkOrders.filter(wo => wo.status === 'pending').length,
    in_progress: allWorkOrders.filter(wo => wo.status === 'in_progress').length,
    completed: allWorkOrders.filter(wo => wo.status === 'completed').length,
    on_hold: allWorkOrders.filter(wo => wo.status === 'on_hold').length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">Assign and manage work steps for operators</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allWorkOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all production orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.in_progress}</div>
            <p className="text-xs text-muted-foreground">
              Currently being worked on
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.completed}</div>
            <p className="text-xs text-muted-foreground">
              Finished work orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting assignment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Work Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Work Orders</CardTitle>
              <CardDescription>
                {filteredWorkOrders.length} of {allWorkOrders.length} work orders
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search work orders..."
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
            {(['all', 'pending', 'in_progress', 'completed', 'on_hold'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="flex items-center space-x-2"
              >
                <span className="capitalize">{status.replace('_', ' ')}</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-1 ${statusFilter === status ? 'bg-white text-black' : ''}`}
                >
                  {statusCounts[status]}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Work Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Production Order</TableHead>
                  <TableHead>Workstation</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No work orders found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkOrders.map((workOrder) => {
                    const StatusIcon = getStatusIcon(workOrder.status)
                    const progress = workOrder.status === 'completed' ? 100 : 
                                   workOrder.status === 'in_progress' ? 50 : 0
                                   
                    return (
                      <TableRow key={workOrder.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="h-4 w-4 text-muted-foreground" />
                            <span>WO-{workOrder.sequence.toString().padStart(3, '0')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{workOrder.operation}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workOrder.productionOrderNumber}</div>
                            <div className="text-sm text-muted-foreground">{workOrder.productName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{workOrder.workstation}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{workOrder.assignedWorker || 'Unassigned'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(workOrder.status)}>
                            {workOrder.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Est: {formatDuration(workOrder.estimatedDuration)}</div>
                            {workOrder.actualDuration && (
                              <div className="text-muted-foreground">
                                Act: {formatDuration(workOrder.actualDuration)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-20">
                            <Progress value={progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">{progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
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