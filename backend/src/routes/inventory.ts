import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/inventory
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const materials = await prisma.material.findMany({
    include: {
      stockMovements: {
        take: 5,
        orderBy: { timestamp: 'desc' }
      }
    }
  })
  res.json(materials)
}))

// POST /api/inventory
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const material = await prisma.material.create({
    data: req.body
  })
  res.status(201).json(material)
}))

export default router