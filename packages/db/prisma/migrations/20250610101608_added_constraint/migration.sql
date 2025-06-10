/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,website_id]` on the table `WebsiteTick` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "WebsiteTick_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteTick_createdAt_website_id_key" ON "WebsiteTick"("createdAt", "website_id");
