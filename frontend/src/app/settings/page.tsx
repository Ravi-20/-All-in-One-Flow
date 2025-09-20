'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Settings, User, Bell, Shield, Database, Palette } from 'lucide-react'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general')

  const sections = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'users', name: 'Users & Roles', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{section.name}</span>
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input defaultValue="ManufactureFlow Industries" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time Zone</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC-6 (Central Time)</option>
                    <option>UTC-7 (Mountain Time)</option>
                    <option>UTC-8 (Pacific Time)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                    <option>GBP - British Pound</option>
                    <option>CAD - Canadian Dollar</option>
                  </select>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>Users & Roles</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">User Accounts</h3>
                    <Button>Add User</Button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'John Smith', email: 'john@company.com', role: 'Admin', status: 'Active' },
                      { name: 'Jane Doe', email: 'jane@company.com', role: 'Manager', status: 'Active' },
                      { name: 'Mike Chen', email: 'mike@company.com', role: 'Operator', status: 'Active' },
                      { name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Inspector', status: 'Inactive' }
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">{user.role}</Badge>
                          <Badge variant={user.status === 'Active' ? 'success' : 'warning'}>
                            {user.status}
                          </Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Production Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified about production issues</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Inventory Warnings</p>
                      <p className="text-sm text-muted-foreground">Low stock and inventory alerts</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Quality Issues</p>
                      <p className="text-sm text-muted-foreground">Failed quality checks and defects</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Reports</p>
                      <p className="text-sm text-muted-foreground">Daily production summary emails</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security and access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                  <Input type="number" defaultValue="30" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password Complexity</p>
                      <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Login Auditing</p>
                      <p className="text-sm text-muted-foreground">Log all login attempts</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                </div>
                <Button>Update Security Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'data' && (
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Backup, export, and data retention settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Backup Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Automatic Backups</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                      <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Data Export</h3>
                  <div className="space-x-2">
                    <Button variant="outline">Export Production Data</Button>
                    <Button variant="outline">Export Inventory Data</Button>
                    <Button variant="outline">Export Quality Data</Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Data Retention (months)</label>
                  <Input type="number" defaultValue="24" />
                </div>
                
                <Button>Save Data Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-md border-2 border-white shadow-md"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-md border-2 border-gray-200 shadow-md"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded-md border-2 border-gray-200 shadow-md"></div>
                    <div className="w-8 h-8 bg-red-500 rounded-md border-2 border-gray-200 shadow-md"></div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Dashboard Layout</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                    <option>Compact</option>
                    <option>Standard</option>
                    <option>Spacious</option>
                  </select>
                </div>
                
                <Button>Apply Changes</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}