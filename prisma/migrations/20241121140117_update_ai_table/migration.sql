/*
  Warnings:

  - You are about to drop the column `authorId` on the `ai_message` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ai_message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ai_conversation` DROP FOREIGN KEY `ai_conversation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ai_message` DROP FOREIGN KEY `ai_message_authorId_fkey`;

-- AlterTable
ALTER TABLE `ai_message` DROP COLUMN `authorId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `ai_message_userId_idx` ON `ai_message`(`userId`);
