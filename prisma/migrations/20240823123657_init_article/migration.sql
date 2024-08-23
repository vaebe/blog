-- CreateTable
CREATE TABLE `Article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `classify` TEXT NULL,
    `coverImg` TEXT NOT NULL,
    `summary` TEXT NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 1,
    `likes` INTEGER NOT NULL DEFAULT 1,
    `favorites` INTEGER NOT NULL DEFAULT 1,
    `showNumber` INTEGER NOT NULL DEFAULT 1,
    `status` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `isDeleted` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickName` TEXT NULL,
    `account` VARCHAR(191) NOT NULL,
    `password` TEXT NOT NULL,
    `role` TEXT NULL,
    `homepage` TEXT NULL,
    `avatar` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `isDeleted` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `User_account_key`(`account`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
