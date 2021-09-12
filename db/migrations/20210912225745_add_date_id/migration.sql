/*
  Warnings:

  - Added the required column `dateId` to the `Journal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "dateId" TEXT NOT NULL;
