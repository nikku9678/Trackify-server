-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "problem_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE SET NULL ON UPDATE CASCADE;
