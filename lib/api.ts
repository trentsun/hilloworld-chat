import OpenAI from 'openai';

const apiKey = process.env.AI_BUILDER_TOKEN || '';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://space.ai-builders.com/backend';

export const openai = new OpenAI({
  baseURL: `${baseURL}/v1`,
  apiKey: apiKey,
});

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessage(
  messages: Message[],
  model: string = 'grok-4-fast'
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '抱歉，没有收到回复。';
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

