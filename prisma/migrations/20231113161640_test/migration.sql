/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `updatedAt`,
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `content` TEXT NULL;

-- AlterTable
ALTER TABLE `profile` MODIFY `bio` TEXT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `name` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RedefineIndex
CREATE INDEX `authorId` ON `Post`(`authorId`);
DROP INDEX `Post_authorId_fkey` ON `post`;

-- RedefineIndex
CREATE UNIQUE INDEX `userId` ON `Profile`(`userId`);
DROP INDEX `Profile_userId_key` ON `profile`;

-- RedefineIndex
CREATE UNIQUE INDEX `email` ON `User`(`email`);
DROP INDEX `User_email_key` ON `user`;
