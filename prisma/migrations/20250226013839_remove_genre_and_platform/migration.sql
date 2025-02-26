/*
  Warnings:

  - You are about to drop the `Genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GenresOnGames` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Platform` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformsOnGames` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GenresOnGames" DROP CONSTRAINT "GenresOnGames_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GenresOnGames" DROP CONSTRAINT "GenresOnGames_genreId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformsOnGames" DROP CONSTRAINT "PlatformsOnGames_gameId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformsOnGames" DROP CONSTRAINT "PlatformsOnGames_platformId_fkey";

-- DropTable
DROP TABLE "Genres";

-- DropTable
DROP TABLE "GenresOnGames";

-- DropTable
DROP TABLE "Platform";

-- DropTable
DROP TABLE "PlatformsOnGames";
