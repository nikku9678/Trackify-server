import axios from "axios";

export interface LeetcodeProblemData {
  title: string;
  difficulty: string;
  link: string;
  topicTags: string[];
}

/**
 * Fetches detailed LeetCode problem information using the GraphQL API.
 */
export const fetchLeetcodeProblem = async (url: string): Promise<LeetcodeProblemData> => {
  if (!url.includes("leetcode.com/problems/")) {
    throw new Error("Invalid LeetCode problem URL");
  }

  try {
    const slugMatch = url.match(/leetcode\.com\/problems\/([^/]+)/);
    if (!slugMatch || !slugMatch[1]) {
      throw new Error("Invalid LeetCode problem URL structure");
    }

    const slug = slugMatch[1];
    const graphqlUrl = "https://leetcode.com/graphql";

    const query = `
      query getQuestionDetail($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          title
          titleSlug
          difficulty
          topicTags {
            name
            slug
          }
        }
      }
    `;

    const response = await axios.post(
      graphqlUrl,
      { query, variables: { titleSlug: slug } },
      { headers: { "Content-Type": "application/json" } }
    );

    const question = response.data?.data?.question;
    if (!question) throw new Error("Could not fetch problem details from LeetCode");

    // Parse stats (JSON string)
    const stats = question.stats ? JSON.parse(question.stats) : {};
    const acceptanceRate = stats.acRate ? `${stats.acRate}%` : "N/A";

    return {
      title: question.title,
      difficulty: question.difficulty,
      link: `https://leetcode.com/problems/${question.titleSlug}/`,
     
      topicTags: question.topicTags.map((tag: any) => tag.name)
     
    };
  } catch (error: any) {
    console.error("Error fetching LeetCode problem:", error.message);
    throw new Error("Failed to fetch detailed LeetCode problem information");
  }
};
