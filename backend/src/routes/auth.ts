import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { AppError, asyncHandler } from '../middleware/errorHandler'
import { logger } from '../utils/logger'

const router = express.Router()
const prisma = new PrismaClient()

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new AppError('JWT secret not configured', 500)
  
  return jwt.sign({ userId }, secret, { expiresIn: '7d' })
}

// POST /api/auth/register
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required')
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed: ' + errors.array().map(e => e.msg).join(', '), 400)
  }

  const { username, email, password, firstName, lastName } = req.body
  
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] }
  })
  
  if (existingUser) {
    throw new AppError('Username or email already exists', 400)
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)
  
  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'OPERATOR',
      permissions: JSON.stringify(['read:production', 'read:inventory']),
      isActive: true
    }
  })
  
  const token = generateToken(user.id)
  logger.info(`New user registered: ${user.username}`)
  
  res.status(201).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: JSON.parse(user.permissions || '[]')
    }
  })
}))

// POST /api/auth/login
router.post('/login', [
  body('username').notEmpty(),
  body('password').isLength({ min: 6 })
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throw new AppError('Validation failed', 400)

  const { username, password } = req.body
  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: username }] }
  })

  if (!user || !user.isActive) throw new AppError('Invalid credentials', 401)
  
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new AppError('Invalid credentials', 401)

  const token = generateToken(user.id)
  logger.info(`User ${user.username} logged in`)

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: JSON.parse(user.permissions || '[]')
    }
  })
}))

// POST /api/auth/verify
router.post('/verify', asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    throw new AppError('No token provided', 401)
  }
  
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new AppError('JWT secret not configured', 500)
    
    const decoded = jwt.verify(token, secret) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })
    
    if (!user || !user.isActive) {
      throw new AppError('Invalid token', 401)
    }
    
    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: JSON.parse(user.permissions || '[]')
      }
    })
  } catch (error) {
    throw new AppError('Invalid token', 401)
  }
}))

export default router