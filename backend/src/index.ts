import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'
import dotenv from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'

// Import routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import productionRoutes from './routes/production'
import inventoryRoutes from './routes/inventory'
import qualityRoutes from './routes/quality'
import analyticsRoutes from './routes/analytics'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const prisma = new PrismaClient()

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000'
    ].filter(Boolean),
    methods: ['GET', 'POST']
  }
})

// Security middleware
app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CORS_ORIGIN || 'http://localhost:3000'
  ].filter(Boolean),
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// General middleware
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/production', authMiddleware, productionRoutes)
app.use('/api/inventory', authMiddleware, inventoryRoutes)
app.use('/api/quality', authMiddleware, qualityRoutes)
app.use('/api/analytics', authMiddleware, analyticsRoutes)

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`)

  // Join user to their department room for targeted updates
  socket.on('join-department', (department: string) => {
    socket.join(department)
    logger.info(`User ${socket.id} joined department: ${department}`)
  })

  // Handle production updates
  socket.on('production-update', (data) => {
    socket.broadcast.emit('production-updated', data)
  })

  // Handle inventory updates
  socket.on('inventory-update', (data) => {
    socket.broadcast.emit('inventory-updated', data)
  })

  // Handle quality updates
  socket.on('quality-update', (data) => {
    socket.broadcast.emit('quality-updated', data)
  })

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`)
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404
  })
})

const PORT = process.env.PORT || 5000

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    logger.info('Process terminated')
  })
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    logger.info('Process terminated')
  })
})

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Manufacturing API Server running on port ${PORT}`)
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`🔌 Socket.IO enabled for real-time updates`)
})

// Make prisma and io available globally
export { prisma, io }