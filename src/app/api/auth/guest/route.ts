import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'Use signIn("guest") from client instead' },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: 'Use signIn("guest") from client instead' },
    { status: 410 }
  );
}
