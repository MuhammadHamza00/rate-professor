import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const systemPrompt = `
You are a Rate My Professor agent designed to help students find classes and professors. Your goal is to answer user questions by retrieving information about the top 3 professors that match the user's query. If you receive relevant information about professors, use it to provide a detailed response. 

If, however, you do not receive any results or the information is insufficient, use your own knowledge to assist the user with their question. Always ensure that your responses are helpful and relevant, even if external data is unavailable.
`;

const generateQueryEmbeddings = async (data) => {
  const api = new OpenAI({ apiKey: process.env.NEXT_AIML_API, baseURL: 'https://api.aimlapi.com' });

  try {
    const queryResponse = await api.embeddings.create({
      input: data,
      model: 'text-embedding-3-small',
    });

    if (queryResponse && queryResponse.data.length > 0) {
      return queryResponse.data[0].embedding;
    } else {
      throw new Error('Failed to generate embedding for query.');
    }
  } catch (error) {
    console.error('Error generating embeddings for text:', error);
    throw error; // Ensure the error is propagated
  }
};


export async function POST(req) {
  const data = await req.json();
  const pc = new Pinecone({
    apiKey: process.env.NEXT_PINECONE_API,
  });
  const index = pc.index('rmp').namespace('ns1');

  const text = data[data.length - 1].content;
  let embedding;
  try {
    embedding = await generateQueryEmbeddings(text);
  } catch (error) {
    console.error('Error generating embeddings:', error);
  }
  // const embedding = await generateQueryEmbeddings(text);
  // if (!embedding || embedding.length !== 1536) {
  //   return NextResponse.json({ error: 'Invalid embedding length. Expected 1536 dimensions.' }, { status: 400 });
  // }
  
  // const results = await index.query({
  //   topK: 5,
  //   includeMetadata: true,
  //   vector: embedding,
  // });
  let resultString = '';
  
  if (embedding && embedding.length === 1536) {
    const results = await index.query({
      topK: 5,
      includeMetadata: true,
      vector: embedding,
    });

    results.matches.forEach((match) => {
      resultString += `
    Returned Results:
    Professor: ${match.id}
    Review: ${match.metadata.stars}
    Subject: ${match.metadata.subject}
    Stars: ${match.metadata.stars}
    Institution: ${match.metadata.institution}
    \n\n`;
    });
    console.log(resultString);
  }
  else {
    console.warn('Embedding not generated or invalid, proceeding without it.');
  }

 
  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage.content + resultString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);
  console.log(lastMessageContent);

  const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_OPEN_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
      "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
    },
  });

  const completion = await openrouter.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      ...lastDataWithoutLastMessage,
      { role: 'user', content: lastMessageContent },
    ],
    model: "meta-llama/llama-3.1-8b-instruct:free",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
