import express, { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// GET /api/users
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  res.json({ users: [] })
}))

export default router