import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export async function generateChapters(booksHeading, description) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a book writer. Generate a minimum of 5 chapter titles and a maximum of 5 subchapter titles for each chapter. Each chapter should have a title and content, and each subchapter should also have a title and content.",
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
                   
                  }
                ]
              },
              {
                "title": "Chapter 2 Title",
                
                "subchapters": [
                  {
                    "title": "Subchapter 1 Title",
                    
                  },
                  {
                    "title": "Subchapter 2 Title",
                    
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

    let response = "";
    for await (const chunk of chatCompletion) {
      response += chunk.choices[0].message.content;
    }

    const result = JSON.parse(response);
    console.log("Parsed result:", result);

    return result;
  } catch (error) {
    console.error("Error generating chapters:", error);
    return null;
  }
}

export default generateChapters;
