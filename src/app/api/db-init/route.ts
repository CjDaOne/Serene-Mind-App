import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db-init';

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Database initialization is not allowed in production' },
        { status: 403 }
      );
    }

    await initializeDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully with indexes',
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
