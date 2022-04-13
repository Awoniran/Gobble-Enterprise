/*
  Warnings:

  - Added the required column `totalPrice` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "payment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalPrice" INTEGER NOT NULL;
