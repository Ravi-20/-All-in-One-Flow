'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    department: 'Manufacturing',
    position: 'Production Manager'
  })

  const handleSave = () => {
    // Here you would typically update the user profile via API
    console.log('Saving profile data:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      department: 'Manufacturing',
      position: 'Production Manager'
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and account settings
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-muted-foreground">{formData.position}</p>
              <p className="text-sm text-muted-foreground">{formData.department}</p>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="capitalize">{user?.role} Access</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-accent rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.firstName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-accent rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.lastName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-accent rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-accent rounded-md">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                {isEditing ? (
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-accent rounded-md">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.location}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department
                </label>
                {isEditing ? (
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-accent rounded-md">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.department}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card border rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Account Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications about production updates</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}