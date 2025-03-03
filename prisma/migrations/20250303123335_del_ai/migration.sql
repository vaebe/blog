/*
  Warnings:

  - You are about to drop the `ai_conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ai_message` DROP FOREIGN KEY `ai_message_conversationId_fkey`;

-- DropTable
DROP TABLE `ai_conversation`;

-- DropTable
DROP TABLE `ai_message`;
