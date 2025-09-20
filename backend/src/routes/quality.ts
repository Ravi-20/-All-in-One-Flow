import express, { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// GET /api/quality
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  res.json({ qualityChecks: [] })
}))

export default router