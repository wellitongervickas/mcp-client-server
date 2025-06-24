import { openai } from '@ai-sdk/openai'
import { z } from 'zod';
import { streamText,  tool } from 'ai';

// import { client } from "@/mcp/client"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  // const tools = await client.tools()
  console.log('messages', messages)

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    maxSteps: 10,
    onError: console.error,
    onFinish: async () => {
      // await client.close();
    },
    tools: {
      // ...tools,
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      }),
  },
  })

  return result.toDataStreamResponse()
}
