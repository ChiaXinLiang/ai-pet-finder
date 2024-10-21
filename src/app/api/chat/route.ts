import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";

import { pets } from "@/pets";

const sizes = {
  small: {
    cat: 5,
    dog: 25,
  },
  medium: {
    cat: 7,
    dog: 50,
  },
  large: {
    cat: 99,
    dog: 99,
  },
};

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful assistant.
You should display a recommended pet or pets after with the showPets tool.
Your goal is to answer questions about adoptable pets.`,
    messages: convertToCoreMessages(messages),
    maxSteps: 4,
    tools: {
      showPets: tool({
        description: `show recommended pets after using the getPets tool.`,
        parameters: z.object({
          pets: z.array(
            z.object({
              id: z.string().describe("the id of the pet to show"),
              recommendation: z
                .string()
                .describe("a recommendation for the pet"),
            })
          ),
        }),
      }),
      getPets: tool({
        description: `get a list of available pets to answer questions about adoption.`,
        parameters: z.object({
          type: z.enum(["cat", "dog"]),
          size: z.enum(["small", "medium", "large"]),
        }),
        execute: async ({
          type,
          size,
        }: {
          type: "cat" | "dog";
          size: "small" | "medium" | "large";
        }) =>
          pets
            .filter((pet) => pet.type === type)
            .filter((pet) => pet.weight <= sizes[size][type]),
      }),
    },
  });

  return result.toDataStreamResponse();
}
