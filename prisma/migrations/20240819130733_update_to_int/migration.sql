/*
  Warnings:

  - You are about to alter the column `isDeleted` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `views` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `likes` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `favorites` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `showNumber` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `Article` MODIFY `isDeleted` INTEGER NULL DEFAULT 0,
    MODIFY `views` INTEGER NOT NULL DEFAULT 1,
    MODIFY `likes` INTEGER NOT NULL DEFAULT 1,
    MODIFY `favorites` INTEGER NOT NULL DEFAULT 1,
    MODIFY `showNumber` INTEGER NOT NULL DEFAULT 1;
