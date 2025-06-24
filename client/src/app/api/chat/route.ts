import { openai } from '@ai-sdk/openai'
import { z } from 'zod';
import { InvalidToolArgumentsError, NoSuchToolError, streamText,  tool, ToolExecutionError } from 'ai';

import { client } from "@/mcp/client"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const tools = await client.tools()
  
  
  console.log('messages', messages)
  console.log('tools', Object.keys(tools))

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    maxSteps: 2,
    onError: console.error,
    // onFinish: async () => {
    //   await client.close();
    // },
    // toolChoice: 'required',
    tools: {
      ...tools,
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

  return result.toDataStreamResponse({
     getErrorMessage: error => {
      if (NoSuchToolError.isInstance(error)) {
        return 'The model tried to call a unknown tool.';
      } else if (InvalidToolArgumentsError.isInstance(error)) {
        return 'The model called a tool with invalid arguments.';
      } else if (ToolExecutionError.isInstance(error)) {
        return 'An error occurred during tool execution.';
      } else {
        return 'An unknown error occurred.';
      }
    },
  })
}
