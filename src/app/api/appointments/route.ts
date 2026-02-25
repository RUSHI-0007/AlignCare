import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Future API Gateway handler for appointments
    return NextResponse.json({ appointments: [] });
}
