/*
  Warnings:

  - Made the column `averageReview` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "averageReview" SET NOT NULL,
ALTER COLUMN "averageReview" SET DATA TYPE DOUBLE PRECISION;
