import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ZodError } from 'zod';

export type ApiSuccessResponse<T> = { data: T };
export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: any;
  };
};

type ApiHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

export function withApiHandler(
  handler: ApiHandler,
  options: { requireAuth?: boolean } = { requireAuth: true }
): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
    const startTime = Date.now();

    try {
      console.log(`[${requestId}] ${request.method} ${request.url}`);

      if (options.requireAuth !== false) {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
          console.log(`[${requestId}] Unauthorized: No session`);
          return NextResponse.json<ApiErrorResponse>(
            {
              error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
              },
            },
            { status: 401 }
          );
        }
      }

      const response = await handler(request, context);
      
      const duration = Date.now() - startTime;
      console.log(`[${requestId}] Response: ${response.status} (${duration}ms)`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (error instanceof ZodError) {
        console.error(`[${requestId}] Validation error (${duration}ms):`, error.issues);
        return NextResponse.json<ApiErrorResponse>(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request data',
              details: error.issues,
            },
          },
          { status: 400 }
        );
      }

      console.error(`[${requestId}] Server error (${duration}ms):`, error);
      return NextResponse.json<ApiErrorResponse>(
        {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
          },
        },
        { status: 500 }
      );
    }
  };
}

export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json<ApiSuccessResponse<T>>({ data }, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: any
): NextResponse {
  return NextResponse.json<ApiErrorResponse>(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}
