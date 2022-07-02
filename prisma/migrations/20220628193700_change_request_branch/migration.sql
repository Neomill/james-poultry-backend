/*
  Warnings:

  - Made the column `request_to_branch` on table `invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `invoice` MODIFY `request_to_branch` VARCHAR(191) NOT NULL;
