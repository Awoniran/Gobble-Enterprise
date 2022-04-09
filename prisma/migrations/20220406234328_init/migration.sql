/*
  Warnings:

  - You are about to drop the column `active` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "active";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
