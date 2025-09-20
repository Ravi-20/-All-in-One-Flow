'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProductionStore } from '@/stores/production'
import { useInventoryStore } from '@/stores/inventory'
import { formatCurrency, formatNumber } from '@/lib/utils'
import RealTimeIndicator from '@/components/demo/real-time-indicator'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'

export default function AnalyticsPage() {
  const { orders, initializeMockData: initProduction } = useProductionStore()
  const { materials, initializeMockData: initInventory } = useInventoryStore()

  useEffect(() => {
    initProduction()
    initInventory()
  }, [])

  // Production data for charts
  const productionByStatus = [
    { status: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { status: 'In Progress', count: orders.filter(o => o.status === 'in_progress').length },
    { status: 'Scheduled', count: orders.filter(o => o.status === 'scheduled').length },
    { status: 'Draft', count: orders.filter(o => o.status === 'draft').length },
    { status: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ].filter(item => item.count > 0)

  // Mock monthly production data
  const monthlyProduction = [
    { month: 'Jan', orders: 45, completed: 42, revenue: 250000 },
    { month: 'Feb', orders: 52, completed: 48, revenue: 280000 },
    { month: 'Mar', orders: 48, completed: 45, revenue: 265000 },
    { month: 'Apr', orders: 61, completed: 58, revenue: 310000 },
    { month: 'May', orders: 55, completed: 52, revenue: 295000 },
    { month: 'Jun', orders: 67, completed: 63, revenue: 340000 }
  ]

  // Inventory value by category
  const inventoryByCategory = materials.reduce((acc, material) => {
    const existing = acc.find(item => item.category === material.category)
    const value = material.currentStock * material.unitCost
    
    if (existing) {
      existing.value += value
      existing.items += 1
    } else {
      acc.push({
        category: material.category,
        value: value,
        items: 1
      })
    }
    return acc
  }, [] as Array<{ category: string; value: number; items: number }>)

  // Quality metrics (mock data)
  const qualityTrends = [
    { month: 'Jan', passRate: 94.5, defectRate: 5.5 },
    { month: 'Feb', passRate: 96.2, defectRate: 3.8 },
    { month: 'Mar', passRate: 95.8, defectRate: 4.2 },
    { month: 'Apr', passRate: 97.1, defectRate: 2.9 },
    { month: 'May', passRate: 96.5, defectRate: 3.5 },
    { month: 'Jun', passRate: 98.2, defectRate: 1.8 }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  // Calculate KPIs
  const totalRevenue = monthlyProduction.reduce((sum, month) => sum + month.revenue, 0)
  const avgCompletionRate = monthlyProduction.reduce((sum, month) => sum + (month.completed / month.orders * 100), 0) / monthlyProduction.length
  const totalInventoryValue = materials.reduce((sum, material) => sum + (material.currentStock * material.unitCost), 0)
  const currentQualityRate = qualityTrends[qualityTrends.length - 1]?.passRate || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your manufacturing operations</p>
        </div>
        <RealTimeIndicator />
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (6M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-green-600 mt-1">+12.5% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletionRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600 mt-1">+2.3% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
            <p className="text-xs text-yellow-600 mt-1">-3.1% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentQualityRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600 mt-1">+4.7% from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Production Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Production Trends</CardTitle>
            <CardDescription>Orders vs Completed orders over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyProduction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#8884d8" name="Total Orders" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyProduction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Production Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Production Status Distribution</CardTitle>
            <CardDescription>Current production orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productionByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {productionByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Trends</CardTitle>
            <CardDescription>Pass rate and defect rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qualityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="passRate" stroke="#82ca9d" name="Pass Rate %" />
                <Line type="monotone" dataKey="defectRate" stroke="#ff7300" name="Defect Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Analysis by Category</CardTitle>
          <CardDescription>Inventory value and item count per category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryByCategory.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-muted-foreground">{category.items} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(category.value)}</p>
                  <p className="text-sm text-muted-foreground">
                    {((category.value / totalInventoryValue) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Production Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>On-Time Delivery</span>
                <Badge variant="success">96.5%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Capacity Utilization</span>
                <Badge variant="info">78%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Order Fulfillment</span>
                <Badge variant="success">94.2%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>First Pass Yield</span>
                <Badge variant="success">92.3%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Defect Rate</span>
                <Badge variant="warning">1.8%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Customer Returns</span>
                <Badge variant="success">0.5%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Inventory Turnover</span>
                <Badge variant="info">6.2x</Badge>
              </div>
              <div className="flex justify-between">
                <span>Stock Accuracy</span>
                <Badge variant="success">99.1%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Obsolete Stock</span>
                <Badge variant="warning">2.3%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}