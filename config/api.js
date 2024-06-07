import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
export async function generateChapters(bookHeading, description) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a book writer. Generate a minimum of 5 chapter titles and a maximum of 5 subchapter titles for each chapter. Each chapter should have a title and content, and each subchapter should also have a title and content.",
      },
      {
        role: "user",
        content: `Generate chapter titles and subchapter titles based on the book title "${booksHeading}" or description: "${description}". Provide the response in the following JSON format:
    
        {
          "chapters": [
            {
              "title": "Chapter 1 Title",
              "content": "Chapter 1 Content",
              "subchapters": [
                {
                  "title": "Subchapter 1 Title",
                  "content": "Subchapter 1 Content"
                },
                {
                  "title": "Subchapter 2 Title",
                  "content": "Subchapter 2 Content"
                }
              ]
            },
            {
              "title": "Chapter 2 Title",
              "content": "Chapter 2 Content",
              "subchapters": [
                {
                  "title": "Subchapter 1 Title",
                  "content": "Subchapter 1 Content"
                },
                {
                  "title": "Subchapter 2 Title",
                  "content": "Subchapter 2 Content"
                }
              ]
            }
          ]
        }`,
      },
    ],
    model: "llama3-70b-8192",
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  let chapters = [];
  for await (const chunk of chatCompletion) {
    chapters.push(...chunk.choices);
  }

  return { chapters };
}

export default generateChapters;
