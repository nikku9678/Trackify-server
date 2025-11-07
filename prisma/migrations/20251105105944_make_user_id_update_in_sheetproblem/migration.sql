/*
  Warnings:

  - A unique constraint covering the columns `[sheet_id,problem_id,user_id]` on the table `SheetProblem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `SheetProblem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SheetProblem_sheet_id_problem_id_key";

-- AlterTable
ALTER TABLE "SheetProblem" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SheetProblem_sheet_id_problem_id_user_id_key" ON "SheetProblem"("sheet_id", "problem_id", "user_id");

-- AddForeignKey
ALTER TABLE "SheetProblem" ADD CONSTRAINT "SheetProblem_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
