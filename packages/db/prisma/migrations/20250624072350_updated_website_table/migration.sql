/*
  Warnings:

  - Added the required column `email` to the `Website` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "serviceName" TEXT NOT NULL;
