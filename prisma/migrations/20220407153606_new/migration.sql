-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNo" TEXT;

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "product" TEXT[],
    "ordered" BOOLEAN,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
