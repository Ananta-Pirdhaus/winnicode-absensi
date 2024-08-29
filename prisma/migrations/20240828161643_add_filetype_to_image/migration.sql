/*
  Warnings:

  - Added the required column `fileType` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_userId_fkey`;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `fileType` VARCHAR(191) NOT NULL,
    MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
