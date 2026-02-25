import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // Webhook for LangChain/OpenAI/Twilio
    return NextResponse.json({ status: 'received' });
}
