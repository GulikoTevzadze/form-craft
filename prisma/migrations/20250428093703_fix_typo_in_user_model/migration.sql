/*
  Warnings:

  - You are about to drop the column `fistName` on the `User` table. All the data in the column will be lost.
  - Added the required column `fisrtName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "fistName",
ADD COLUMN     "fisrtName" TEXT NOT NULL;
