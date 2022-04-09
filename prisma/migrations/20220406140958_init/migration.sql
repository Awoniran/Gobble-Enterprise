/*
  Warnings:

  - Added the required column `averageReview` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "averageReview" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
