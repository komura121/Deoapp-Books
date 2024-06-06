import axios from "axios";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const isTestMode = import.meta.env.VITE_TEST_MODE === "true";

const generateChapters = async (bookHeading, description) => {
  if (isTestMode) {
    // Mock response for test mode
    return `Mock response for book heading: ${bookHeading} and description: ${description}`;
  }

  const endpoint = "https://api.aimlapi.com/v1/chat/completions";
  const data = {
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [
      { role: "system", content: "You are a book writer. Generate a minimum of 5 chapter titles and a maximum of 5 subchapter titles for each." },
      { role: "user", content: `Generate chapter titles and subchapter titles based on the book heading: ${bookHeading} with description: ${description}` },
    ],
    max_tokens: 100, // Adjust the token limit as needed
  };

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error making API call:", error);
    throw error;
  }
};

export default generateChapters;
