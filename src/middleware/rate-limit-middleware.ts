import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimiter } from '@/lib/rate-limit';
import type { Session } from 'next-auth';

export type RateLimitConfig = {
  requests: number;
  window: number;
};

function getIdentifier(req: NextRequest, session: Session | null): string {
  // Use user email as key (each guest now has a unique email, so no bucket collision)
  if (session?.user?.email) return `user:${session.user.email}`;

  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';
  return `ip:${ip}`;
}

/**
 * Fetches the session once and passes it to the handler to avoid redundant
 * getServerSession calls deeper in the stack (withApiHandler + route handler
 * each called it separately before this refactor).
 */
export async function withRateLimit(
  req: NextRequest,
  handler: (req: NextRequest, session: Session | null) => Promise<NextResponse>,
  config: RateLimitConfig
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const identifier = getIdentifier(req, session);

  const result = await rateLimiter.limit(identifier, config);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.requests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.reset).toISOString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  const response = await handler(req, session);

  response.headers.set('X-RateLimit-Limit', config.requests.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString());

  return response;
}
