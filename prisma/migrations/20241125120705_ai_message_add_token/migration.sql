/*
  Warnings:

  - Added the required column `token` to the `ai_message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ai_message` ADD COLUMN `token` INTEGER NOT NULL;
