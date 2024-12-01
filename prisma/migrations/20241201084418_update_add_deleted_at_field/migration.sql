-- AlterTable
ALTER TABLE `ai_conversation` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ai_message` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `message` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `subscriber` ADD COLUMN `deletedAt` DATETIME(3) NULL;
