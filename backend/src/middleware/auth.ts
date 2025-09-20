import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { AppError } from './errorHandler'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    username: string
    email: string
    role: string
    permissions: string[]
  }
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new AppError('Access denied. No token provided', 401)
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new AppError('JWT secret not configured', 500)
    }

    const decoded = jwt.verify(token, secret) as any

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        permissions: true,
        isActive: true,
      },
    })

    if (!user) {
      throw new AppError('User not found', 401)
    }

    if (!user.isActive) {
      throw new AppError('User account is disabled', 401)
    }

    // Parse permissions from JSON string
    let permissions: string[] = []
    try {
      permissions = JSON.parse(user.permissions || '[]')
    } catch (e) {
      logger.warn(`Failed to parse permissions for user ${user.id}`)
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions,
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403))
    }

    next()
  }
}

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401))
    }

    if (!req.user.permissions.includes(permission)) {
      return next(new AppError('Insufficient permissions', 403))
    }

    next()
  }
}