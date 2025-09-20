const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createDemoUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { username: 'admin' }
    })

    if (existingAdmin) {
      console.log('Demo admin user already exists')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@manufactureflow.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        permissions: JSON.stringify([
          'create:production',
          'read:production',
          'update:production',
          'delete:production',
          'create:inventory',
          'read:inventory',
          'update:inventory',
          'delete:inventory',
          'create:quality',
          'read:quality',
          'update:quality',
          'delete:quality',
          'read:analytics',
          'manage:users'
        ]),
        isActive: true
      }
    })

    console.log('Demo admin user created successfully:', {
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    })

  } catch (error) {
    console.error('Error creating demo user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoUser()