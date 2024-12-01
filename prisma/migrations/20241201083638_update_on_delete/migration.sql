-- DropForeignKey
ALTER TABLE `ai_message` DROP FOREIGN KEY `ai_message_conversationId_fkey`;

-- AddForeignKey
ALTER TABLE `ai_message` ADD CONSTRAINT `ai_message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `ai_conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
