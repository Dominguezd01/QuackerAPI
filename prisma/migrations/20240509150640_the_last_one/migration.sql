/*
  Warnings:

  - A unique constraint covering the columns `[post_id,user_id]` on the table `requacks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "requacks_unique" ON "requacks"("post_id", "user_id");
