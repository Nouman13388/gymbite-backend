/*
  Warnings:

  - You are about to drop the column `deviceToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firebaseUid` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_firebaseUid_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deviceToken",
DROP COLUMN "firebaseUid";
