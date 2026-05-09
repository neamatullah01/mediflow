/*
  Warnings:

  - You are about to drop the column `patientId` on the `drug_interaction_checks` table. All the data in the column will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `pharmacyId` on table `drug_interaction_checks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "drug_interaction_checks" DROP CONSTRAINT "drug_interaction_checks_patientId_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_pharmacyId_fkey";

-- AlterTable
ALTER TABLE "drug_interaction_checks" DROP COLUMN "patientId",
ALTER COLUMN "pharmacyId" SET NOT NULL;

-- DropTable
DROP TABLE "patients";

-- AddForeignKey
ALTER TABLE "drug_interaction_checks" ADD CONSTRAINT "drug_interaction_checks_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
