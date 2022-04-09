-- CreateEnum
CREATE TYPE "active" AS ENUM ('Boolean');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "averageReview" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "review" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "productId" INTEGER,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "delivered" BOOLEAN NOT NULL,
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
