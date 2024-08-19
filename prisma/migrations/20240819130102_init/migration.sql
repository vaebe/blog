-- CreateTable
CREATE TABLE `Article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `isDeleted` BIGINT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,
    `title` VARBINARY(100) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `classify` VARBINARY(200) NOT NULL,
    `coverImg` VARBINARY(200) NOT NULL,
    `summary` VARBINARY(300) NOT NULL,
    `views` BIGINT NOT NULL DEFAULT 1,
    `likes` BIGINT NOT NULL DEFAULT 1,
    `favorites` BIGINT NOT NULL DEFAULT 1,
    `showNumber` BIGINT NOT NULL DEFAULT 1,
    `status` VARBINARY(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
