/*
  Warnings:

  - Added the required column `role` to the `ai_message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ai_message` ADD COLUMN `annotations` JSON NULL,
    ADD COLUMN `experimentalAttachments` JSON NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL,
    ADD COLUMN `toolInvocations` JSON NULL;
