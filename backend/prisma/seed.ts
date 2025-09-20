import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@manufactureflow.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      department: 'IT',
      permissions: JSON.stringify(['all'])
    }
  })

  // Create sample materials
  const materials = await Promise.all([
    prisma.material.upsert({
      where: { code: 'STL-001' },
      update: {},
      create: {
        code: 'STL-001',
        name: 'Steel Rod 10mm',
        description: 'High-grade steel rod for machining',
        category: 'Raw Materials',
        unit: 'meters',
        currentStock: 150,
        minimumStock: 50,
        maximumStock: 500,
        unitCost: 12.50,
        supplier: 'Steel Corp Ltd',
        location: 'Warehouse A-1'
      }
    }),
    prisma.material.upsert({
      where: { code: 'ALU-002' },
      update: {},
      create: {
        code: 'ALU-002',
        name: 'Aluminum Sheet 2mm',
        description: 'Aluminum sheet for housing manufacturing',
        category: 'Raw Materials',
        unit: 'sheets',
        currentStock: 25,
        minimumStock: 20,
        maximumStock: 100,
        unitCost: 45.00,
        supplier: 'Aluminum Works',
        location: 'Warehouse B-2'
      }
    })
  ])

  // Create sample production order
  const productionOrder = await prisma.productionOrder.create({
    data: {
      orderNumber: 'PO-2024-001',
      productName: 'Steel Widget Assembly',
      productCode: 'SWA-001',
      description: 'High-precision steel widget for industrial use',
      quantity: 100,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      progress: 65,
      estimatedCost: 5000,
      actualCost: 4800,
      createdById: admin.id
    }
  })

  console.log('✅ Seed completed successfully!')
  console.log(`👤 Admin user: admin / admin123`)
  console.log(`📦 Created ${materials.length} materials`)
  console.log(`🏭 Created 1 production order`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })