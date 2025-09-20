// Production Types
export interface ProductionOrder {
  id: string
  orderNumber: string
  productName: string
  productCode: string
  quantity: number
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  startDate: Date
  dueDate: Date
  completedDate?: Date
  progress: number
  workOrders: WorkOrder[]
  materials: MaterialRequirement[]
  estimatedCost: number
  actualCost: number
  createdAt: Date
  updatedAt: Date
}

export interface WorkOrder {
  id: string
  productionOrderId: string
  workstation: string
  operation: string
  sequence: number
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold'
  estimatedDuration: number // in minutes
  actualDuration?: number
  startTime?: Date
  endTime?: Date
  assignedWorker: string
  notes?: string
  qualityChecks: QualityCheck[]
}

// Inventory Types
export interface Material {
  id: string
  code: string
  name: string
  description: string
  category: string
  unit: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  unitCost: number
  supplier: string
  location: string
  lastUpdated: Date
}

export interface MaterialRequirement {
  materialId: string
  material: Material
  requiredQuantity: number
  allocatedQuantity: number
  consumedQuantity: number
  status: 'pending' | 'allocated' | 'partially_consumed' | 'consumed'
}

export interface StockMovement {
  id: string
  materialId: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  reference?: string
  timestamp: Date
  user: string
}

// Quality Control Types
export interface QualityCheck {
  id: string
  workOrderId: string
  checkPoint: string
  inspector: string
  status: 'pending' | 'passed' | 'failed' | 'rework_required'
  checkDate: Date
  parameters: QualityParameter[]
  notes?: string
  defects: Defect[]
}

export interface QualityParameter {
  id: string
  name: string
  specification: string
  actualValue: string
  status: 'pass' | 'fail'
  tolerance?: string
}

export interface Defect {
  id: string
  type: string
  description: string
  severity: 'minor' | 'major' | 'critical'
  quantity: number
  action: 'rework' | 'scrap' | 'accept'
}

// Analytics Types
export interface ProductionMetrics {
  totalOrders: number
  completedOrders: number
  inProgressOrders: number
  overDueOrders: number
  averageCompletionTime: number
  onTimeDeliveryRate: number
  qualityRate: number
  utilizationRate: number
}

export interface InventoryMetrics {
  totalMaterials: number
  lowStockMaterials: number
  totalValue: number
  turnoverRate: number
  stockOuts: number
}

// User Types
export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'manager' | 'operator' | 'inspector'
  firstName: string
  lastName: string
  department: string
  permissions: string[]
  isActive: boolean
  createdAt: Date
}

// Dashboard Types
export interface DashboardData {
  productionMetrics: ProductionMetrics
  inventoryMetrics: InventoryMetrics
  recentOrders: ProductionOrder[]
  alerts: Alert[]
  upcomingDeadlines: ProductionOrder[]
}

export interface Alert {
  id: string
  type: 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionRequired: boolean
}

// Work Center Types
export interface WorkCenter {
  id: string
  name: string
  code: string
  description: string
  location: string
  capacity: number
  currentLoad: number
  status: 'active' | 'maintenance' | 'offline'
  utilization: number
  downtime: number
  efficiency: number
  operators: string[]
  capabilities: string[]
  createdAt: Date
  updatedAt: Date
}

// Stock Movement Types
export interface StockLedgerEntry {
  id: string
  materialId: string
  material: Material
  movementType: 'in' | 'out' | 'adjustment' | 'transfer'
  quantity: number
  unitCost: number
  totalValue: number
  balanceAfter: number
  reference: string
  reason: string
  location: string
  timestamp: Date
  user: string
}

// Bill of Materials Types
export interface BOMItem {
  id: string
  materialId: string
  material: Material
  quantity: number
  unit: string
  wastagePercentage: number
  cost: number
  isOptional: boolean
}

export interface BillOfMaterial {
  id: string
  productCode: string
  productName: string
  version: string
  description: string
  status: 'draft' | 'active' | 'obsolete'
  items: BOMItem[]
  totalCost: number
  laborCost: number
  overheadCost: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}