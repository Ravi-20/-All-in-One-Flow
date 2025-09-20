'use client'

import { useState } from 'react'
import { Plus, Search, Filter, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatDateTime } from '@/lib/utils'
import RealTimeIndicator from '@/components/demo/real-time-indicator'

// Mock quality check data
const mockQualityChecks = [
  {
    id: '1',
    workOrderId: 'wo-1',
    productionOrder: 'PO-2024-001',
    product: 'Steel Widget Assembly',
    checkPoint: 'Dimensional Check',
    inspector: 'Sarah Johnson',
    status: 'passed' as const,
    checkDate: new Date('2024-01-15T14:30:00'),
    parameters: [
      { name: 'Length', specification: '100±0.5mm', actualValue: '100.2mm', status: 'pass' as const },
      { name: 'Width', specification: '50±0.3mm', actualValue: '49.8mm', status: 'pass' as const },
      { name: 'Height', specification: '25±0.2mm', actualValue: '25.1mm', status: 'pass' as const }
    ],
    defects: []
  },
  {
    id: '2',
    workOrderId: 'wo-2',
    productionOrder: 'PO-2024-001',
    product: 'Steel Widget Assembly',
    checkPoint: 'Surface Finish',
    inspector: 'Mike Chen',
    status: 'failed' as const,
    checkDate: new Date('2024-01-16T09:15:00'),
    parameters: [
      { name: 'Roughness', specification: 'Ra 1.6μm', actualValue: 'Ra 2.1μm', status: 'fail' as const },
      { name: 'Scratches', specification: 'None visible', actualValue: '2 minor scratches', status: 'fail' as const }
    ],
    defects: [
      { 
        id: 'def-1',
        type: 'Surface Defect',
        description: 'Minor scratches on top surface',
        severity: 'minor' as const,
        quantity: 2,
        action: 'rework' as const
      }
    ]
  },
  {
    id: '3',
    workOrderId: 'wo-3',
    productionOrder: 'PO-2024-002',
    product: 'Aluminum Housing',
    checkPoint: 'Assembly Check',
    inspector: 'Lisa Wang',
    status: 'pending' as const,
    checkDate: new Date('2024-01-17T11:00:00'),
    parameters: [],
    defects: []
  }
]

const mockDefects = [
  {
    id: 'def-1',
    productionOrder: 'PO-2024-001',
    product: 'Steel Widget Assembly',
    type: 'Surface Defect',
    description: 'Minor scratches on top surface',
    severity: 'minor' as const,
    quantity: 2,
    action: 'rework' as const,
    reportedBy: 'Mike Chen',
    reportedAt: new Date('2024-01-16T09:15:00'),
    status: 'open' as const
  },
  {
    id: 'def-2',
    productionOrder: 'PO-2024-003',
    product: 'Gear Assembly',
    type: 'Dimensional',
    description: 'Bore diameter out of tolerance',
    severity: 'major' as const,
    quantity: 1,
    action: 'scrap' as const,
    reportedBy: 'Tom Rodriguez',
    reportedAt: new Date('2024-01-14T16:45:00'),
    status: 'resolved' as const
  }
]

export default function QualityPage() {
  const [activeTab, setActiveTab] = useState<'checks' | 'defects'>('checks')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredChecks = mockQualityChecks.filter(check => {
    const matchesSearch = check.productionOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.inspector.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || check.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredDefects = mockDefects.filter(defect => {
    const matchesSearch = defect.productionOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         defect.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         defect.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || defect.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'rework_required':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'passed':
        return 'success'
      case 'failed':
        return 'destructive'
      case 'pending':
        return 'warning'
      case 'rework_required':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'major':
        return 'warning'
      case 'minor':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const passedChecks = mockQualityChecks.filter(c => c.status === 'passed').length
  const failedChecks = mockQualityChecks.filter(c => c.status === 'failed').length
  const pendingChecks = mockQualityChecks.filter(c => c.status === 'pending').length
  const qualityRate = mockQualityChecks.length > 0 ? (passedChecks / mockQualityChecks.length) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
          <p className="text-muted-foreground">Monitor quality checks and manage defects</p>
        </div>
        <div className="flex items-center space-x-4">
          <RealTimeIndicator />
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Quality Check
          </Button>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passedChecks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedChecks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingChecks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        <button
          onClick={() => setActiveTab('checks')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'checks'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Quality Checks
        </button>
        <button
          onClick={() => setActiveTab('defects')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'defects'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Defects
        </button>
      </div>

      {/* Filters */}
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
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              {activeTab === 'checks' ? (
                <>
                  <option value="pending">Pending</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="rework_required">Rework Required</option>
                </>
              ) : (
                <>
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </>
              )}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Content Tables */}
      {activeTab === 'checks' ? (
        <Card>
          <CardHeader>
            <CardTitle>Quality Checks</CardTitle>
            <CardDescription>
              {filteredChecks.length} of {mockQualityChecks.length} checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Production Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Check Point</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChecks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell className="font-medium">{check.productionOrder}</TableCell>
                    <TableCell>{check.product}</TableCell>
                    <TableCell>{check.checkPoint}</TableCell>
                    <TableCell>{check.inspector}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(check.status)}
                        <Badge variant={getStatusBadgeVariant(check.status) as any}>
                          {check.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatDateTime(check.checkDate)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Defects</CardTitle>
            <CardDescription>
              {filteredDefects.length} of {mockDefects.length} defects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Production Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDefects.map((defect) => (
                  <TableRow key={defect.id}>
                    <TableCell className="font-medium">{defect.productionOrder}</TableCell>
                    <TableCell>{defect.product}</TableCell>
                    <TableCell>{defect.type}</TableCell>
                    <TableCell>{defect.description}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityBadgeVariant(defect.severity) as any}>
                        {defect.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{defect.action}</TableCell>
                    <TableCell>{defect.reportedBy}</TableCell>
                    <TableCell>
                      <Badge variant={defect.status === 'resolved' ? 'success' : 'warning' as any}>
                        {defect.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}