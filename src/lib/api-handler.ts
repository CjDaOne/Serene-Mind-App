import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ZodError } from 'zod';
import type { Session } from 'next-auth';

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

type ApiHandler = (
  request: NextRequest,
  context?: unknown
) => Promise<NextResponse>;

/**
 * @param preloadedSession — Pass when already fetched by withRateLimit to
 *   avoid a redundant getServerSession round-trip.
 */
export function withApiHandler(
  handler: ApiHandler,
  options: { requireAuth?: boolean; session?: Session | null } = { requireAuth: true }
): ApiHandler {
  return async (request: NextRequest, context?: unknown) => {
    const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
    const startTime = Date.now();

    try {
      console.log(`[${requestId}] ${request.method} ${request.url}`);

      if (options.requireAuth !== false) {
        const session =
          options.session !== undefined
            ? options.session
            : await getServerSession(authOptions);

        if (!session?.user?.id) {
          return NextResponse.json<ApiErrorResponse>(
            { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
            { status: 401 }
          );
        }
      }

      const response = await handler(request, context);
      console.log(`[${requestId}] ${response.status} (${Date.now() - startTime}ms)`);
      return response;
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json<ApiErrorResponse>(
          { error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: error.issues } },
          { status: 400 }
        );
      }
      console.error(`[${requestId}] Server error:`, error);
      return NextResponse.json<ApiErrorResponse>(
        { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
        { status: 500 }
      );
    }
  };
}

/**
 * Returns data directly — NOT wrapped in { data: T }.
 *
 * BUG FIX: The original wrapper returned { data: T } but ALL frontend
 * components read response.json() directly as T. This meant every real-user
 * API call was silently broken (guest/demo mode worked, masking the issue).
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown
): NextResponse {
  return NextResponse.json<ApiErrorResponse>(
    { error: { code, message, details } },
    { status }
  );
}
