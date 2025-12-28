import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, Message } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await sendMessage(messages as Message[], model || 'grok-4-fast');
    
    return NextResponse.json({ 
      message: response,
      success: true 
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to get response from AI',
        success: false 
      },
      { status: 500 }
    );
  }
}

