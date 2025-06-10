/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `WebsiteTick` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WebsiteTick_id_key" ON "WebsiteTick"("id");
