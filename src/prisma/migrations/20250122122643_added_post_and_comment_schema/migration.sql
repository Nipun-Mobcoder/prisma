/*
  Warnings:

  - A unique constraint covering the columns `[user_id,title]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_user_id_title_key" ON "Post"("user_id", "title");
