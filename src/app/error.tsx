'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-headline">Something Went Wrong</CardTitle>
          </div>
          <CardDescription>We encountered an unexpected error.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message || 'An unexpected error occurred. Please try again.'}
            </AlertDescription>
          </Alert>
          {error.digest && (
            <p className="mt-4 text-sm text-muted-foreground">
              Error ID: <code className="bg-muted px-2 py-1 rounded text-xs">{error.digest}</code>
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          <Button asChild variant="outline" className="w-full">
            <a href="/">Go Home</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
