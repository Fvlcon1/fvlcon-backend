/*
  Warnings:

  - You are about to drop the column `rtspurl` on the `Stream` table. All the data in the column will be lost.
  - Added the required column `rtspUrl` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "rtspurl",
ADD COLUMN     "rtspUrl" TEXT NOT NULL,
ALTER COLUMN "cameraFolderId" DROP NOT NULL;
