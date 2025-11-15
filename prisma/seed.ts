import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1️⃣ Create Users
  const user1 = await prisma.user.create({
    data: {
      username: 'nikku',
      email: 'nikku@example.com',
      password_hash: 'hashedpassword123',
      phone: '9876543210',
      profile: {
        create: {
          linkedin_url: 'https://linkedin.com/in/nikku',
          github_url: 'https://github.com/nikku',
          leetcode_url: 'https://leetcode.com/nikku',
          bio: 'Full Stack Developer | MERN + Salesforce',
        },
      },
    },
    include: { profile: true },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'rahul',
      email: 'rahul@example.com',
      password_hash: 'hashedpassword456',
      profile: {
        create: {
          linkedin_url: 'https://linkedin.com/in/rahul',
          github_url: 'https://github.com/rahuldev',
          leetcode_url: 'https://leetcode.com/rahul',
          bio: 'Backend Enthusiast | NodeJS & PostgreSQL',
        },
      },
    },
  });

  // 2️⃣ Create Problems
  const problem1 = await prisma.problem.create({
    data: {
      platform: 'LeetCode',
      title: 'Two Sum',
      link: 'https://leetcode.com/problems/two-sum/',
      difficulty: 'Easy',
    },
  });

  const problem2 = await prisma.problem.create({
    data: {
      platform: 'GFG',
      title: 'Detect Cycle in Directed Graph',
      link: 'https://www.geeksforgeeks.org/detect-cycle-in-a-directed-graph/',
      difficulty: 'Medium',
    },
  });

  const problem3 = await prisma.problem.create({
    data: {
      platform: 'Codeforces',
      title: 'Beautiful Matrix',
      link: 'https://codeforces.com/problemset/problem/263/A',
      difficulty: 'Easy',
    },
  });

  // 3️⃣ Create a Sheet for user1 (FIXED sheetProblems with user_id)
  const sheet = await prisma.sheet.create({
    data: {
      user_id: user1.user_id,
      title: 'DSA Master Sheet',
      description: 'A sheet containing the best DSA problems to practice daily.',
      is_public: true,
      sheetProblems: {
        create: [
          {
            problem_id: problem1.problem_id,
            order_index: 1,
            user_id: user1.user_id,   // ✅ FIXED
          },
          {
            problem_id: problem2.problem_id,
            order_index: 2,
            user_id: user1.user_id,   // ✅ FIXED
          },
          {
            problem_id: problem3.problem_id,
            order_index: 3,
            user_id: user1.user_id,   // ✅ FIXED
          },
        ],
      },
    },
  });

  // 4️⃣ Create Notes
  await prisma.note.createMany({
    data: [
      {
        user_id: user1.user_id,
        sheet_id: sheet.sheet_id,
        title: 'Graph Basics',
        description: 'Understand adjacency list vs matrix.',
      },
      {
        user_id: user2.user_id,
        title: 'Dynamic Programming',
        description: 'Practice tabulation method daily.',
      },
    ],
  });

  // 5️⃣ Create Problem Statuses
  await prisma.userProblemStatus.createMany({
    data: [
      {
        user_id: user1.user_id,
        problem_id: problem1.problem_id,
        status: 'Solved',
      },
      {
        user_id: user1.user_id,
        problem_id: problem2.problem_id,
        status: 'Attempted',
      },
      {
        user_id: user2.user_id,
        problem_id: problem3.problem_id,
        status: 'NotStarted',
      },
    ],
  });

  // 6️⃣ Create Followers (user2 follows user1)
  await prisma.follower.create({
    data: {
      follower_id: user2.user_id,
      following_id: user1.user_id,
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
