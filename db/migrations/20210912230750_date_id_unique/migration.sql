/*
  Warnings:

  - A unique constraint covering the columns `[dateId]` on the table `Journal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Journal.dateId_unique" ON "Journal"("dateId");
