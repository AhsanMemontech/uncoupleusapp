import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { message, userId, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Create conversation context for AI
    const conversationContext = conversationHistory ? 
      conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })) : [];

    // Create a context-aware prompt for divorce law questions
    const systemPrompt = `You are Uncouple, a helpful legal assistant specializing in New York divorce law. You provide accurate, helpful information about divorce processes, custody, support, property division, and legal procedures in NY. Always be empathetic and professional. If you don't know something specific, recommend consulting with an attorney. Keep responses concise but informative. Use the conversation context to provide more relevant and contextual responses.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext,
      { role: 'user', content: message }
    ];

    // console.log('DEBUG: Sending to AI with context:', {
    //   messageCount: conversationContext.length,
    //   lastMessage: message,
    //   contextPreview: conversationContext.slice(-3)
    // });

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I\'m having trouble processing your request right now. Please try again or consider speaking with one of our attorneys for immediate assistance.';

    // Log the interaction for analytics (optional)
    if (userId) {
      console.log(`Chat interaction - User: ${userId}, Question: ${message}, Context: ${conversationContext.length} messages`);
    }

    return NextResponse.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return a fallback response
    return NextResponse.json({
      response: "I'm experiencing technical difficulties right now. Please try again in a moment, or feel free to schedule a consultation with one of our attorneys for immediate assistance.",
      timestamp: new Date().toISOString()
    });
  }
} 