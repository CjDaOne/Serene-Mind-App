import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SignJWT } from 'jose';

export async function POST(req: NextRequest) {
  try {
    // Check if user already has a session
    const session = await getServerSession(authOptions);
    if (session?.user?.id && !session.user.isGuest) {
      return NextResponse.json(
        { error: 'Already authenticated' },
        { status: 400 }
      );
    }

    // Generate unique guest ID
    const guestId = `guest-${crypto.randomUUID()}`;
    
    // Create guest session token
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    );
    
    const token = await new SignJWT({
      sub: guestId,
      isGuest: true,
      name: 'Guest User',
      email: null,
      image: null,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30m') // 30 minutes
      .sign(secret);

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      guestId,
      isGuest: true,
      expiresIn: 1800, // 30 minutes in seconds
    });

    // Set NextAuth session cookie
    response.cookies.set('next-auth.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1800, // 30 minutes
      path: '/',
    });

    // Also set callback URL for development
    response.cookies.set('__Secure-next-auth.session-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1800,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Guest session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create guest session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create guest session.' },
    { status: 405 }
  );
}
