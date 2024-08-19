/*
  Warnings:

  - You are about to alter the column `title` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `VarBinary(100)` to `VarChar(191)`.
  - You are about to alter the column `classify` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `VarBinary(200)` to `VarChar(191)`.
  - You are about to alter the column `coverImg` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `VarBinary(200)` to `VarChar(191)`.
  - You are about to alter the column `summary` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `VarBinary(300)` to `VarChar(191)`.
  - You are about to alter the column `status` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `VarBinary(6)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Article` MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `classify` VARCHAR(191) NOT NULL,
    MODIFY `coverImg` VARCHAR(191) NOT NULL,
    MODIFY `summary` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;
