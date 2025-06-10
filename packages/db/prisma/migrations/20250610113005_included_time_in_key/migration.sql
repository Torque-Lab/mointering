/*
  Warnings:

  - The primary key for the `website_tick` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "website_tick_createdAt_id_key";

-- AlterTable
ALTER TABLE "website_tick" DROP CONSTRAINT "website_tick_pkey",
ADD CONSTRAINT "website_tick_pkey" PRIMARY KEY ("id", "createdAt");
