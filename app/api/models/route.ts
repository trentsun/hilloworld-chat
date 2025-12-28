import { NextResponse } from 'next/server';
import { openai } from '@/lib/api';

export async function GET() {
  try {
    // 尝试从 API 获取模型列表
    const models = await openai.models.list();
    
    return NextResponse.json({
      success: true,
      models: models.data.map((model) => ({
        id: model.id,
        name: model.id,
        description: model.description || '',
      })),
    });
  } catch (error: any) {
    console.error('Error fetching models:', error);
    
    // 如果 API 调用失败，返回默认模型列表
    return NextResponse.json({
      success: true,
      models: [
        { id: 'grok-4-fast', name: 'Grok-4-fast', description: '快速且高效的模型' },
        { id: 'deepseek', name: 'DeepSeek', description: '快速且经济实惠的模型' },
        { id: 'supermind-agent-v1', name: 'Supermind Agent', description: '多工具代理，支持网络搜索' },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Google Gemini 模型' },
        { id: 'gpt-5', name: 'GPT-5', description: 'OpenAI GPT-5 模型' },
      ],
    });
  }
}

