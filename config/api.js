import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;

const makeApiCall = async (data) => {
  try {
    const response = await axios.post("https://api.openai.com/v1/engines/davinci-codex/completions", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error making API call:", error);
    throw error;
  }
};

export default makeApiCall;
