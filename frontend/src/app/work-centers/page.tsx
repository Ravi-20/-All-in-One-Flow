'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  TrendingUp,
  TrendingDown,
  Settings
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WorkCenter } from '@/types'

// Mock data for work centers
const mockWorkCenters: WorkCenter[] = [
  {
    id: '1',
    name: 'CNC Machining Center 01',
    code: 'CNC-01',
    description: 'High-precision CNC machining for metal components',
    location: 'Building A - Floor 1',
    capacity: 24,
    currentLoad: 18,
    status: 'active',
    utilization: 75,
    downtime: 2.5,
    efficiency: 92,
    operators: ['John Smith', 'Mike Johnson'],
    capabilities: ['Milling', 'Turning', 'Drilling'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Assembly Station 01',
    code: 'ASM-01',
    description: 'Manual assembly line for electronic components',
    location: 'Building B - Floor 2',
    capacity: 16,
    currentLoad: 12,
    status: 'active',
    utilization: 80,
    downtime: 1.2,
    efficiency: 88,
    operators: ['Jane Doe', 'Sarah Wilson', 'Tom Brown'],
    capabilities: ['Assembly', 'Testing', 'Packaging'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '3',
    name: 'Welding Station 02',
    code: 'WLD-02',
    description: 'Automated welding station for steel fabrication',
    location: 'Building A - Floor 2',
    capacity: 20,
    currentLoad: 8,
    status: 'maintenance',
    utilization: 40,
    downtime: 8.5,
    efficiency: 65,
    operators: ['Robert Davis'],
    capabilities: ['Arc Welding', 'MIG Welding', 'TIG Welding'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '4',
    name: 'Quality Inspection Bay',
    code: 'QC-01',
    description: 'Quality control and inspection facility',
    location: 'Building C - Floor 1',
    capacity: 12,
    currentLoad: 10,
    status: 'active',
    utilization: 83,
    downtime: 0.8,
    efficiency: 95,
    operators: ['Lisa Anderson', 'David White'],
    capabilities: ['Visual Inspection', 'Dimensional Check', 'Testing'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-23')
  },
  {
    id: '5',
    name: 'Painting Booth 01',
    code: 'PNT-01',
    description: 'Automated spray painting facility',
    location: 'Building D - Floor 1',
    capacity: 8,
    currentLoad: 0,
    status: 'offline',
    utilization: 0,
    downtime: 24,
    efficiency: 0,
    operators: [],
    capabilities: ['Spray Painting', 'Powder Coating', 'Drying'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-24')
  }
]

export default function WorkCentersPage() {
  const [workCenters] = useState<WorkCenter[]>(mockWorkCenters)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'maintenance' | 'offline'>('all')

  // Filter work centers based on search and status
  const filteredWorkCenters = workCenters.filter(center => {
    const matchesSearch = !searchTerm || 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || center.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: WorkCenter['status']) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'maintenance':
        return 'warning'
      case 'offline':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status: WorkCenter['status']) => {
    switch (status) {
      case 'active':
        return CheckCircle
      case 'maintenance':
        return Wrench
      case 'offline':
        return AlertTriangle
      default:
        return Clock
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'text-green-600'
    if (utilization >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const statusCounts = {
    all: workCenters.length,
    active: workCenters.filter(wc => wc.status === 'active').length,
    maintenance: workCenters.filter(wc => wc.status === 'maintenance').length,
    offline: workCenters.filter(wc => wc.status === 'offline').length
  }

  const totalCapacity = workCenters.reduce((sum, wc) => sum + wc.capacity, 0)
  const totalLoad = workCenters.reduce((sum, wc) => sum + wc.currentLoad, 0)
  const averageUtilization = workCenters.length > 0 ? 
    workCenters.reduce((sum, wc) => sum + wc.utilization, 0) / workCenters.length : 0
  const averageEfficiency = workCenters.length > 0 ? 
    workCenters.reduce((sum, wc) => sum + wc.efficiency, 0) / workCenters.length : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Centers</h1>
          <p className="text-muted-foreground">Manage machines/locations capacity, downtime, and utilization</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Work Center
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Centers</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workCenters.length}</div>
            <p className="text-xs text-muted-foreground">
              {statusCounts.active} active, {statusCounts.offline + statusCounts.maintenance} unavailable
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity}h</div>
            <p className="text-xs text-muted-foreground">
              {totalLoad}h currently loaded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageUtilization.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all work centers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Work Centers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Work Centers</CardTitle>
              <CardDescription>
                {filteredWorkCenters.length} of {workCenters.length} work centers
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search work centers..."
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
            {(['all', 'active', 'maintenance', 'offline'] as const).map((status) => (
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

          {/* Work Centers Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Center</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Downtime</TableHead>
                  <TableHead>Operators</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkCenters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No work centers found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkCenters.map((center) => {
                    const StatusIcon = getStatusIcon(center.status)
                    
                    return (
                      <TableRow key={center.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{center.name}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {center.code} - {center.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{center.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(center.status)}>
                            {center.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{center.currentLoad}h / {center.capacity}h</div>
                            <Progress 
                              value={(center.currentLoad / center.capacity) * 100} 
                              className="h-2 w-20 mt-1"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getUtilizationColor(center.utilization)}`}>
                            {center.utilization}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getUtilizationColor(center.efficiency)}`}>
                            {center.efficiency}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={center.downtime > 5 ? 'text-red-600' : 'text-green-600'}>
                            {center.downtime}h
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{center.operators.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
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

      {/* Capabilities Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Capabilities Overview</CardTitle>
          <CardDescription>Available capabilities across all work centers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from(new Set(workCenters.flatMap(wc => wc.capabilities))).map(capability => {
              const centersWithCapability = workCenters.filter(wc => 
                wc.capabilities.includes(capability) && wc.status === 'active'
              )
              
              return (
                <div key={capability} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{capability}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Available at {centersWithCapability.length} work center{centersWithCapability.length !== 1 ? 's' : ''}
                  </p>
                  <div className="mt-2">
                    {centersWithCapability.slice(0, 3).map(center => (
                      <Badge key={center.id} variant="outline" className="mr-1 mb-1 text-xs">
                        {center.code}
                      </Badge>
                    ))}
                    {centersWithCapability.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{centersWithCapability.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}