/*
  Warnings:

  - You are about to drop the column `day` on the `DaySession` table. All the data in the column will be lost.
  - The `endedAt` column on the `DaySession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endedAt` column on the `Pause` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endedAt` column on the `TaskSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `startedAt` on the `DaySession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startedAt` on the `Pause` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startedAt` on the `TaskSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DaySession" DROP COLUMN "day",
DROP COLUMN "startedAt",
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endedAt",
ADD COLUMN     "endedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Pause" DROP COLUMN "startedAt",
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endedAt",
ADD COLUMN     "endedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TaskSession" DROP COLUMN "startedAt",
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endedAt",
ADD COLUMN     "endedAt" TIMESTAMP(3);
