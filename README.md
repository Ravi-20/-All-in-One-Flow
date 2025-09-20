# ManufactureFlow - Manufacturing Management System

A comprehensive, modular manufacturing management application that enables businesses to create, track, and manage their end-to-end production process digitally. This platform replaces fragmented spreadsheets and manual tracking with a unified, real-time system.

## 🚀 Features

### Frontend (Next.js React Application)
- **📊 Dashboard** - Real-time overview with key metrics, alerts, and KPIs
- **🏭 Production Management** - Complete production order lifecycle tracking
- **📦 Inventory Management** - Material tracking, stock levels, and movement history
- **🔍 Quality Control** - Quality checkpoints, defect tracking, and inspection forms
- **📈 Analytics** - Rich charts and reporting for production insights
- **⚙️ Settings** - User management, permissions, and system configuration

### Backend (Node.js/Express API)
- **🔐 Authentication** - JWT-based auth with role-based access control
- **🗃️ Database** - SQLite with Prisma ORM for development
- **📡 Real-time Updates** - Socket.io for live data synchronization
- **🛡️ Security** - Helmet, CORS, rate limiting, and input validation
- **📝 Logging** - Winston-based structured logging
- **🔄 API Routes** - RESTful endpoints for all modules

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Recharts** - Data visualization
- **Lucide React** - Modern icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Database (development)
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Winston** - Logging

## 🏗️ Project Structure

```
Flow-4/
├── frontend/                 # Next.js React application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── stores/          # Zustand state management
│   │   ├── types/           # TypeScript type definitions
│   │   └── lib/             # Utility functions
│   └── package.json
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/          # API endpoint routes
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Main server file
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.ts          # Database seeding
│   │   └── migrations/      # Database migrations
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Backend Setup
```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```
Backend runs on: `http://localhost:5000`

### Default Login
- **Username:** admin
- **Password:** admin123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Production
- `GET /api/production` - Get production orders
- `POST /api/production` - Create production order

### Inventory
- `GET /api/inventory` - Get materials
- `POST /api/inventory` - Create material

### Quality
- `GET /api/quality` - Get quality checks

### Analytics
- `GET /api/analytics` - Get analytics data

### System
- `GET /health` - Health check

## 🎯 Key Features Implemented

### Production Management
- ✅ Production order creation and tracking
- ✅ Work order management
- ✅ Progress tracking with visual indicators
- ✅ Priority and status management
- ✅ Real-time updates

### Inventory Management
- ✅ Material master data management
- ✅ Stock level monitoring
- ✅ Low stock alerts
- ✅ Stock movement tracking
- ✅ Category-based organization

### Quality Control
- ✅ Quality checkpoint definitions
- ✅ Inspection parameter tracking
- ✅ Defect recording and management
- ✅ Quality metrics and reporting
- ✅ Pass/fail status tracking

### Analytics & Reporting
- ✅ Production performance metrics
- ✅ Inventory value analysis
- ✅ Quality trend tracking
- ✅ Interactive charts and graphs
- ✅ KPI dashboard

### Real-time Features
- ✅ Socket.io integration
- ✅ Live production updates
- ✅ Inventory change notifications
- ✅ Quality status broadcasts

## 🔧 Development

### Database Schema
The application uses a comprehensive schema covering:
- User management and roles
- Production orders and work orders
- Material and inventory tracking
- Quality control and defects
- Audit logging and system settings

### State Management
- Frontend uses Zustand for lightweight state management
- Real-time synchronization via Socket.io
- Optimistic updates for better UX

### Security
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting and CORS protection

## 🚀 Deployment Ready

The application is designed for easy deployment:
- Environment-based configuration
- Database migration support
- Docker-ready structure
- Production logging
- Health check endpoints

## 📈 Future Enhancements

- Real-time notifications
- Advanced reporting
- Mobile application
- Integration APIs
- Advanced analytics
- Multi-tenant support

---

Built with ❤️ for modern manufacturing management.