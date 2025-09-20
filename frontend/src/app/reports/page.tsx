'use client'

import { useState } from 'react'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type ReportType = 'production' | 'quality' | 'inventory' | 'performance' | 'all'
type TimeRange = '7d' | '30d' | '90d' | '1y'

interface Report {
  id: string
  title: string
  type: ReportType
  description: string
  generatedAt: Date
  size: string
  status: 'completed' | 'processing' | 'failed'
  downloadUrl?: string
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Production Summary - Q4 2024',
    type: 'production',
    description: 'Comprehensive production metrics and KPIs for the fourth quarter',
    generatedAt: new Date('2024-12-15'),
    size: '2.4 MB',
    status: 'completed',
    downloadUrl: '/reports/production-q4-2024.pdf'
  },
  {
    id: '2',
    title: 'Quality Control Analysis - December',
    type: 'quality',
    description: 'Quality metrics, defect rates, and inspection results',
    generatedAt: new Date('2024-12-10'),
    size: '1.8 MB',
    status: 'completed',
    downloadUrl: '/reports/quality-dec-2024.pdf'
  },
  {
    id: '3',
    title: 'Inventory Movement Report',
    type: 'inventory',
    description: 'Stock levels, consumption rates, and material requirements',
    generatedAt: new Date('2024-12-08'),
    size: '3.1 MB',
    status: 'completed',
    downloadUrl: '/reports/inventory-movement-2024.pdf'
  },
  {
    id: '4',
    title: 'Work Center Performance Analysis',
    type: 'performance',
    description: 'Machine utilization, downtime analysis, and efficiency metrics',
    generatedAt: new Date('2024-12-05'),
    size: '2.7 MB',
    status: 'processing'
  },
  {
    id: '5',
    title: 'Monthly Production Dashboard',
    type: 'production',
    description: 'High-level overview of manufacturing operations and trends',
    generatedAt: new Date('2024-12-01'),
    size: '1.5 MB',
    status: 'completed',
    downloadUrl: '/reports/monthly-dashboard-nov-2024.pdf'
  }
]

const reportTypeColors = {
  production: 'bg-blue-100 text-blue-800 border-blue-200',
  quality: 'bg-green-100 text-green-800 border-green-200',
  inventory: 'bg-purple-100 text-purple-800 border-purple-200',
  performance: 'bg-orange-100 text-orange-800 border-orange-200'
}

const reportTypeIcons = {
  production: Activity,
  quality: TrendingUp,
  inventory: Package,
  performance: TrendingDown
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<ReportType>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d')

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || report.type === selectedType
    return matchesSearch && matchesType
  })

  const handleDownload = (report: Report) => {
    if (report.downloadUrl) {
      // In a real app, this would trigger the actual download
      console.log('Downloading report:', report.title)
      // window.open(report.downloadUrl, '_blank')
    }
  }

  const generateNewReport = () => {
    console.log('Generating new report...')
    // In a real app, this would trigger report generation
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
          <p className="text-muted-foreground mt-2">
            Access and download your manufacturing reports and analytics
          </p>
        </div>
        <Button onClick={generateNewReport}>
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ReportType)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="production">Production</option>
              <option value="quality">Quality</option>
              <option value="inventory">Inventory</option>
              <option value="performance">Performance</option>
            </select>
            
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const IconComponent = reportTypeIcons[report.type as keyof typeof reportTypeIcons]
          
          return (
            <div
              key={report.id}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium border",
                    reportTypeColors[report.type as keyof typeof reportTypeColors]
                  )}>
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                  </span>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  report.status === 'completed' && "bg-green-100 text-green-800",
                  report.status === 'processing' && "bg-yellow-100 text-yellow-800",
                  report.status === 'failed' && "bg-red-100 text-red-800"
                )}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </div>
              </div>
              
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                {report.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {report.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{report.generatedAt.toLocaleDateString()}</span>
                </div>
                <span>{report.size}</span>
              </div>
              
              <div className="flex gap-2">
                {report.status === 'completed' && report.downloadUrl && (
                  <Button
                    size="sm"
                    onClick={() => handleDownload(report)}
                    className="flex-1"
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Download
                  </Button>
                )}
                {report.status === 'processing' && (
                  <Button size="sm" disabled className="flex-1">
                    <Clock className="h-3 w-3 mr-2" />
                    Processing...
                  </Button>
                )}
                {report.status === 'failed' && (
                  <Button size="sm" variant="outline" className="flex-1">
                    Retry
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or generate a new report.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-medium">Production Report</div>
              <div className="text-xs text-muted-foreground mt-1">
                Generate current production metrics
              </div>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-medium">Quality Analysis</div>
              <div className="text-xs text-muted-foreground mt-1">
                Export quality control data
              </div>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-medium">Inventory Status</div>
              <div className="text-xs text-muted-foreground mt-1">
                Current stock levels report
              </div>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-medium">Custom Report</div>
              <div className="text-xs text-muted-foreground mt-1">
                Build your own report
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}