-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PHARMACIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "PharmacyStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DrugCategory" AS ENUM ('ANTIBIOTIC', 'ANALGESIC', 'ANTIDIABETIC', 'CARDIOVASCULAR', 'VITAMIN', 'RESPIRATORY', 'ANTIFUNGAL', 'ANTIVIRAL', 'ANTIHISTAMINE', 'GASTROINTESTINAL', 'PSYCHIATRIC', 'OTHER');

-- CreateEnum
CREATE TYPE "DosageForm" AS ENUM ('TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM', 'INHALER', 'DROPS');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InteractionSeverity" AS ENUM ('SAFE', 'MODERATE', 'DANGEROUS');

-- CreateTable
CREATE TABLE "pharmacies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "PharmacyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PHARMACIST',
    "avatarUrl" TEXT,
    "phone" TEXT,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "pharmacyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drugs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT NOT NULL,
    "category" "DrugCategory" NOT NULL,
    "dosageForm" "DosageForm" NOT NULL,
    "description" TEXT NOT NULL,
    "uses" TEXT[],
    "commonDosage" TEXT,
    "sideEffects" TEXT[],
    "contraindications" TEXT[],
    "storage" TEXT,
    "manufacturer" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "batchNumber" TEXT,
    "reorderLevel" INTEGER NOT NULL DEFAULT 10,
    "supplierName" TEXT,
    "status" "InventoryStatus" NOT NULL DEFAULT 'IN_STOCK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_orders" (
    "id" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "expectedDelivery" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_line_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispensing_logs" (
    "id" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "pharmacistId" TEXT NOT NULL,
    "patientName" TEXT,
    "quantityDispensed" INTEGER NOT NULL,
    "dispensedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispensing_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "medications" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drug_interaction_checks" (
    "id" TEXT NOT NULL,
    "patientId" TEXT,
    "pharmacyId" TEXT,
    "drugsChecked" TEXT[],
    "overallRisk" "InteractionSeverity" NOT NULL,
    "resultJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drug_interaction_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drug_reviews" (
    "id" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "pharmacistId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drug_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_sessions" (
    "id" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "readTime" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DrugToDrugInteractionCheck" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DrugToDrugInteractionCheck_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "pharmacies_licenseNumber_key" ON "pharmacies"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_pharmacyId_drugId_batchNumber_key" ON "inventory_items"("pharmacyId", "drugId", "batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "drug_reviews_drugId_pharmacistId_key" ON "drug_reviews"("drugId", "pharmacistId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "_DrugToDrugInteractionCheck_B_index" ON "_DrugToDrugInteractionCheck"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drugs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_orders" ADD CONSTRAINT "supplier_orders_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line_items" ADD CONSTRAINT "order_line_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "supplier_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line_items" ADD CONSTRAINT "order_line_items_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drugs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensing_logs" ADD CONSTRAINT "dispensing_logs_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensing_logs" ADD CONSTRAINT "dispensing_logs_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensing_logs" ADD CONSTRAINT "dispensing_logs_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drugs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensing_logs" ADD CONSTRAINT "dispensing_logs_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drug_interaction_checks" ADD CONSTRAINT "drug_interaction_checks_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drug_reviews" ADD CONSTRAINT "drug_reviews_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drugs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drug_reviews" ADD CONSTRAINT "drug_reviews_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chat_sessions" ADD CONSTRAINT "ai_chat_sessions_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chat_sessions" ADD CONSTRAINT "ai_chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ai_chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DrugToDrugInteractionCheck" ADD CONSTRAINT "_DrugToDrugInteractionCheck_A_fkey" FOREIGN KEY ("A") REFERENCES "drugs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DrugToDrugInteractionCheck" ADD CONSTRAINT "_DrugToDrugInteractionCheck_B_fkey" FOREIGN KEY ("B") REFERENCES "drug_interaction_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
