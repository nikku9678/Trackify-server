-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('LeetCode', 'GFG', 'Codeforces', 'Other');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Medium', 'Hard');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NotStarted', 'Attempted', 'Solved');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "leetcode_url" TEXT,
    "bio" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "Sheet" (
    "sheet_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "share_token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("sheet_id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "problem_id" SERIAL NOT NULL,
    "platform" "Platform" NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("problem_id")
);

-- CreateTable
CREATE TABLE "SheetProblem" (
    "id" SERIAL NOT NULL,
    "sheet_id" INTEGER NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "order_index" INTEGER,

    CONSTRAINT "SheetProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProblemStatus" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NotStarted',
    "last_attempted" TIMESTAMP(3),
    "custom_note" TEXT,

    CONSTRAINT "UserProblemStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "note_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sheet_id" INTEGER,
    "title" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,
    "followed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("follower_id","following_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_link_key" ON "Problem"("link");

-- CreateIndex
CREATE UNIQUE INDEX "SheetProblem_sheet_id_problem_id_key" ON "SheetProblem"("sheet_id", "problem_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProblemStatus_user_id_problem_id_key" ON "UserProblemStatus"("user_id", "problem_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetProblem" ADD CONSTRAINT "SheetProblem_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("sheet_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetProblem" ADD CONSTRAINT "SheetProblem_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProblemStatus" ADD CONSTRAINT "UserProblemStatus_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProblemStatus" ADD CONSTRAINT "UserProblemStatus_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "Sheet"("sheet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
