/*
  Warnings:

  - You are about to drop the column `rating` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Games" DROP COLUMN "rating",
DROP COLUMN "releaseDate";
