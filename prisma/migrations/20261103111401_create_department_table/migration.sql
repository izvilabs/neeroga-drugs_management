-- CreateTable
CREATE TABLE "departments" (
    "DepartmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" "DepartmentStatus" NOT NULL DEFAULT 'PROCESSING',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("DepartmentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");
