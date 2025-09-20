'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Factory, 
  Package, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Wrench,
  MapPin,
  FileText,
  List,
  ChevronRight,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import AuthWrapper from '@/components/auth/auth-wrapper'
import { useRealTime } from '@/hooks/useRealTime'
import NotificationsPanel from './notifications-panel'
import ConnectionStatus from './connection-status'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Production', href: '/production', icon: Factory },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Quality Control', href: '/quality', icon: ClipboardCheck },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const masterMenuItems = [
  { 
    name: 'Manufacturing Orders', 
    href: '/', 
    icon: Factory,
    description: 'Create and track production orders'
  },
  { 
    name: 'Work Orders', 
    href: '/work-orders', 
    icon: List,
    description: 'Assign and manage work steps for operators'
  },
  { 
    name: 'Work Centers', 
    href: '/work-centers', 
    icon: MapPin,
    description: 'Manage machines/locations capacity, downtime, and utilization'
  },
  { 
    name: 'Stock Ledger', 
    href: '/stock-ledger', 
    icon: Package,
    description: 'Track material movement and inventory balance'
  },
  { 
    name: 'Bills of Material (BOM)', 
    href: '/bom', 
    icon: FileText,
    description: 'Define material requirements per finished good'
  },
  { 
    name: 'Manual Data Entry', 
    href: '/manual-data', 
    icon: Plus,
    description: 'Add production orders, materials, and stock movements manually'
  }
]

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [masterMenuOpen, setMasterMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  
  // Real-time functionality
  const { 
    isConnected, 
    connectionError, 
    notifications, 
    markNotificationAsRead, 
    clearNotifications 
  } = useRealTime()

  // Check if current path is auth page
  const isAuthPage = pathname?.startsWith('/auth')

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  // If it's an auth page, render without the main layout
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Desktop Layout */}
        <div className="flex lg:h-screen lg:min-h-screen overflow-hidden">
          {/* Left Sidebar */}
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 bg-card border-r transform transition-all duration-300 ease-in-out flex flex-col lg:relative lg:z-auto lg:h-full lg:overflow-hidden",
            // Mobile behavior
            "lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            // Desktop width based on collapsed state
            sidebarCollapsed ? "lg:w-16" : "lg:w-64",
            // Mobile always full width when open
            "w-64"
          )}>
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <h1 className={cn(
                "text-xl font-bold text-primary transition-opacity duration-300",
                sidebarCollapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : "opacity-100"
              )}>
                ManufactureFlow
              </h1>
              <div className="flex items-center space-x-2">
                {/* Burger menu - always visible on desktop, close on mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <nav className="mt-6 px-3 flex-1 overflow-y-auto">
              {/* Main Navigation */}
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group relative",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                        onClick={() => setSidebarOpen(false)}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <Icon className={cn(
                          "h-5 w-5 flex-shrink-0",
                          sidebarCollapsed ? "mx-auto" : "mr-3"
                        )} />
                        <span className={cn(
                          "transition-opacity duration-300",
                          sidebarCollapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : "opacity-100"
                        )}>
                          {item.name}
                        </span>
                        {/* Tooltip for collapsed state */}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden lg:block">
                            {item.name}
                          </div>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              
              {/* Master Menu Section */}
              <div className="mt-8">
                <div className="mb-4">
                  <button
                    onClick={() => setMasterMenuOpen(!masterMenuOpen)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent group relative",
                      masterMenuOpen ? "bg-accent" : ""
                    )}
                    title={sidebarCollapsed ? "Master Menu" : undefined}
                  >
                    <List className={cn(
                      "h-5 w-5 flex-shrink-0",
                      sidebarCollapsed ? "mx-auto" : "mr-3"
                    )} />
                    <span className={cn(
                      "transition-opacity duration-300 flex-1 text-left",
                      sidebarCollapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : "opacity-100"
                    )}>
                      Master Menu
                    </span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-all duration-200",
                      sidebarCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100",
                      masterMenuOpen && "rotate-180"
                    )} />
                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden lg:block">
                        Master Menu
                      </div>
                    )}
                  </button>
                </div>
                
                {/* Master Menu Items */}
                <div className={cn(
                  "space-y-1 transition-all duration-300 overflow-hidden",
                  masterMenuOpen && !sidebarCollapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                  sidebarCollapsed && "lg:max-h-0 lg:opacity-0"
                )}>
                  {masterMenuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center px-6 py-2 text-sm rounded-lg transition-colors ml-3",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                        onClick={() => {
                          setSidebarOpen(false)
                          setMasterMenuOpen(false)
                        }}
                      >
                        <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </nav>
            
            {/* Profile & Setup Section */}
            <div className="mt-auto border-t px-3 py-4">
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent group"
                  title={sidebarCollapsed ? `${user?.firstName} ${user?.lastName}` : undefined}
                >
                  <div className={cn(
                    "flex items-center flex-1",
                    sidebarCollapsed ? "justify-center" : "space-x-3"
                  )}>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className={cn(
                      "text-left transition-opacity duration-300",
                      sidebarCollapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : "opacity-100"
                    )}>
                      <p className="text-sm font-medium text-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-all duration-200",
                    sidebarCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100",
                    profileMenuOpen && "rotate-180"
                  )} />
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden lg:block bottom-0">
                      {user?.firstName} {user?.lastName}
                    </div>
                  )}
                </button>
                
                {/* Profile Menu */}
                {profileMenuOpen && !sidebarCollapsed && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => {
                          setProfileMenuOpen(false)
                          setSidebarOpen(false)
                        }}
                      >
                        <User className="h-4 w-4 mr-3 text-muted-foreground" />
                        My Profile
                      </Link>
                      <Link
                        href="/reports"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => {
                          setProfileMenuOpen(false)
                          setSidebarOpen(false)
                        }}
                      >
                        <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                        My Reports
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen lg:h-full lg:overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between h-16 px-6 bg-card border-b flex-shrink-0 lg:border-b-border">
              <div className="flex items-center space-x-4">
                {/* Mobile hamburger menu */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {/* Page title or breadcrumb can go here */}
                <div className="hidden sm:block">
                  {/* You can add page title or breadcrumb here */}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Real-time connection status */}
                <ConnectionStatus 
                  isConnected={isConnected}
                  connectionError={connectionError}
                />
                
                {/* Real-time notifications */}
                <NotificationsPanel
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                  onClearAll={clearNotifications}
                />
                
                {/* User Menu */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 px-3"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:block text-sm">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Page content */}
            <main className="flex-1 lg:overflow-y-auto lg:h-full bg-background">
              <div className="max-w-7xl mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}