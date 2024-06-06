import axios from "axios";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const generateChapters = async (bookHeading, description) => {
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
