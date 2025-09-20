import express, { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// GET /api/analytics
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  res.json({ analytics: {} })
}))

export default router