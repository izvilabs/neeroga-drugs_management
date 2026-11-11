-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "DepartmentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('DRUGS', 'INVENTORY');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('MAIN_STORE', 'MANAGER_STORE', 'DEPARTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('MANUAL', 'REQUEST_BASED', 'DEPARTMENT_TO_DEPARTMENT');

-- CreateTable
CREATE TABLE "user_table" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "number" TEXT,
    "profileImage" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "privilages" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "user_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_table" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DepartmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "discription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drugs_category_table" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discription" TEXT,

    CONSTRAINT "drugs_category_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drugs_table" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "bufferlevel" INTEGER NOT NULL DEFAULT 0,
    "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "drugs_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drugs_batches_table" (
    "id" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "issuedate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "drugs_batches_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "transferType" "TransferType" NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,
    "managerId" TEXT,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockTransfer" (
    "id" TEXT NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transationType" "TransferType" NOT NULL,
    "FromLocation" TEXT NOT NULL,
    "ToLocation" TEXT NOT NULL,
    "requestId" TEXT,
    "transferredById" TEXT NOT NULL,

    CONSTRAINT "StockTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DepartmentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DepartmentToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_table_email_key" ON "user_table"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_table_number_key" ON "user_table"("number");

-- CreateIndex
CREATE UNIQUE INDEX "location_managerId_key" ON "location"("managerId");

-- CreateIndex
CREATE UNIQUE INDEX "location_departmentId_key" ON "location"("departmentId");

-- CreateIndex
CREATE INDEX "_DepartmentToUser_B_index" ON "_DepartmentToUser"("B");

-- AddForeignKey
ALTER TABLE "drugs_table" ADD CONSTRAINT "drugs_table_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "drugs_category_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drugs_batches_table" ADD CONSTRAINT "drugs_batches_table_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drugs_batches_table" ADD CONSTRAINT "drugs_batches_table_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "drugs_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drugs_batches_table" ADD CONSTRAINT "drugs_batches_table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentToUser" ADD CONSTRAINT "_DepartmentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "department_table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentToUser" ADD CONSTRAINT "_DepartmentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user_table"("id") ON DELETE CASCADE ON UPDATE CASCADE;
