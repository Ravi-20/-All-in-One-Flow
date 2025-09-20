-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OPERATOR',
    "department" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "permissions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "production_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "startDate" DATETIME,
    "dueDate" DATETIME NOT NULL,
    "completedDate" DATETIME,
    "progress" REAL NOT NULL DEFAULT 0,
    "estimatedCost" REAL NOT NULL,
    "actualCost" REAL NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "production_orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productionOrderId" TEXT NOT NULL,
    "workstation" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "estimatedDuration" INTEGER NOT NULL,
    "actualDuration" INTEGER,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "assignedWorkerId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "work_orders_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "production_orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_orders_assignedWorkerId_fkey" FOREIGN KEY ("assignedWorkerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "currentStock" REAL NOT NULL DEFAULT 0,
    "minimumStock" REAL NOT NULL DEFAULT 0,
    "maximumStock" REAL NOT NULL DEFAULT 0,
    "unitCost" REAL NOT NULL,
    "supplier" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "material_requirements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productionOrderId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "requiredQuantity" REAL NOT NULL,
    "allocatedQuantity" REAL NOT NULL DEFAULT 0,
    "consumedQuantity" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "material_requirements_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "production_orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "material_requirements_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "materialId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "reason" TEXT NOT NULL,
    "reference" TEXT,
    "userId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stock_movements_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_movements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quality_checks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productionOrderId" TEXT,
    "workOrderId" TEXT,
    "checkPoint" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "checkDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quality_checks_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "production_orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quality_checks_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quality_checks_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quality_parameters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qualityCheckId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specification" TEXT NOT NULL,
    "actualValue" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tolerance" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quality_parameters_qualityCheckId_fkey" FOREIGN KEY ("qualityCheckId") REFERENCES "quality_checks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "defects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qualityCheckId" TEXT,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "reportedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "defects_qualityCheckId_fkey" FOREIGN KEY ("qualityCheckId") REFERENCES "quality_checks" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldData" TEXT,
    "newData" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "production_orders_orderNumber_key" ON "production_orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "materials_code_key" ON "materials"("code");

-- CreateIndex
CREATE UNIQUE INDEX "material_requirements_productionOrderId_materialId_key" ON "material_requirements"("productionOrderId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");
