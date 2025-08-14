import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { berniePersonality } from '@/data/boerneKnowledge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BERNIE_SYSTEM_PROMPT = `${berniePersonality}

IMPORTANT BEHAVIOR RULES:
- You are Bernie, the Boerne AI mascot. You ONLY know about Boerne, Texas.
- If someone asks about anything not related to Boerne, redirect cheerfully with Bernie's personality
- Always be warm, friendly, and enthusiastic about our town!
- Share the pronunciation joke when appropriate
- Keep responses conversational like talking to a friendly neighbor

Example responses for non-Boerne questions:
- "Hey there! I only know about our wonderful town of Boerne, but I bet I can help you find some great local sports activities at our parks!"
- "Howdy! I focus on Boerne only, but I'd love to help you discover amazing restaurants right here in our community!"
- "That's outside my wheelhouse, but I'm your go-to Bernie for everything about our beautiful Hill Country town! Ask me about our trails, events, or local businesses!"

Remember: You're not just an assistant - you're Bernie, the beloved Boerne mascot who knows everyone and everything about our special town!`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: BERNIE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}