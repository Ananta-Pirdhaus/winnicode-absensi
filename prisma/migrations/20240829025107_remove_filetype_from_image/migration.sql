/*
  Warnings:

  - You are about to drop the column `fileType` on the `image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_userId_fkey`;

-- AlterTable
ALTER TABLE `image` DROP COLUMN `fileType`,
    MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
