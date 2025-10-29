import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimiter } from '@/lib/rate-limit';

export type RateLimitConfig = {
  requests: number;
  window: number;
};

function getIdentifier(req: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  return `ip:${ip}`;
}

export async function withRateLimit(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const identifier = getIdentifier(req, session?.user?.email || undefined);

  const result = await rateLimiter.limit(identifier, config);

  if (!result.success) {
    const resetDate = new Date(result.reset);
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
          'X-RateLimit-Reset': resetDate.toISOString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  const response = await handler(req);
  
  response.headers.set('X-RateLimit-Limit', config.requests.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString());

  return response;
}
