/*
  Warnings:

  - Made the column `fileType` on table `image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `image` MODIFY `fileType` VARCHAR(191) NOT NULL;
