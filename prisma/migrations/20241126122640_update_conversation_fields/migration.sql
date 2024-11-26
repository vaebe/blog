/*
  Warnings:

  - Made the column `name` on table `ai_conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ai_conversation` ADD COLUMN `desc` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;
