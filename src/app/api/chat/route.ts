import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful assistant.
Your goal is to answer questions about adoptable pets.`,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
