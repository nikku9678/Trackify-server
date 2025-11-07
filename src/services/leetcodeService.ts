import axios from "axios";

export interface LeetcodeProblemData {
  title: string;
  difficulty: string;
  link: string;
}

/**
 * Fetches LeetCode problem details using LeetCode's GraphQL API.
 */
export const fetchLeetcodeProblem = async (url: string): Promise<LeetcodeProblemData> => {
  if (!url.includes("leetcode.com/problems/")) {
    throw new Error("Invalid LeetCode problem URL");
  }

  try {
    // Extract the slug from the URL
    const slugMatch = url.match(/leetcode\.com\/problems\/([^/]+)/);
    if (!slugMatch || !slugMatch[1]) {
      throw new Error("Invalid LeetCode problem URL structure");
    }

    const slug = slugMatch[1];

    // GraphQL API endpoint
    const graphqlUrl = "https://leetcode.com/graphql";

    // GraphQL query
    const query = `
      query getQuestionDetail($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          title
          difficulty
          titleSlug
        }
      }
    `;

    const response = await axios.post(
      graphqlUrl,
      { query, variables: { titleSlug: slug } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const question = response.data?.data?.question;

    if (!question) {
      throw new Error("Could not fetch problem details from LeetCode");
    }

    const { title, difficulty, titleSlug } = question;

    return {
      title,
      difficulty,
      link: `https://leetcode.com/problems/${titleSlug}/`,
    };
  } catch (error: any) {
    console.error("Error fetching LeetCode problem:", error.message);
    throw new Error("Failed to fetch LeetCode problem details from API");
  }
};
