import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/production
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const orders = await prisma.productionOrder.findMany({
    include: {
      workOrders: true,
      materialRequirements: {
        include: { material: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  res.json(orders)
}))

// POST /api/production
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.productionOrder.create({
    data: {
      ...req.body,
      createdById: 'temp-user-id' // Will be from auth context
    }
  })
  res.status(201).json(order)
}))

export default router