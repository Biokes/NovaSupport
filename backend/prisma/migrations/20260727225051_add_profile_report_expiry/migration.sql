/*
  Warnings:

  - Added the required column `expiresAt` to the `profile_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile_reports" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "reporterIp" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "profile_reports_expiresAt_idx" ON "profile_reports"("expiresAt");
