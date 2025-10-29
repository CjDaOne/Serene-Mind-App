'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, { title: string; description: string; severity: 'error' | 'warning' }> = {
    Configuration: {
      title: 'Server Configuration Error',
      description: 'There is a problem with the server configuration. Please contact support.',
      severity: 'error',
    },
    AccessDenied: {
      title: 'Access Denied',
      description: 'You do not have permission to sign in. Please contact an administrator.',
      severity: 'warning',
    },
    Verification: {
      title: 'Email Verification Failed',
      description: 'The verification link has expired or has already been used. Please request a new one.',
      severity: 'warning',
    },
    OAuthSignin: {
      title: 'OAuth Sign In Error',
      description: 'There was an error during the OAuth sign in process.',
      severity: 'error',
    },
    OAuthCallback: {
      title: 'OAuth Callback Error',
      description: 'There was an error during the OAuth callback process.',
      severity: 'error',
    },
    OAuthCreateAccount: {
      title: 'Could Not Create OAuth Account',
      description: 'There was an error creating your account with the OAuth provider.',
      severity: 'error',
    },
    EmailCreateAccount: {
      title: 'Could Not Create Email Account',
      description: 'There was an error creating your account with email.',
      severity: 'error',
    },
    Callback: {
      title: 'Callback Error',
      description: 'There was an error in the authentication callback.',
      severity: 'error',
    },
    OAuthAccountNotLinked: {
      title: 'Account Not Linked',
      description: 'This email is already associated with a different sign-in method. Please use your original sign-in method.',
      severity: 'warning',
    },
    EmailSignin: {
      title: 'Email Sign In Error',
      description: 'There was an error sending the verification email. Please try again.',
      severity: 'error',
    },
    CredentialsSignin: {
      title: 'Sign In Failed',
      description: 'Invalid credentials. Please check your email and password.',
      severity: 'warning',
    },
    SessionRequired: {
      title: 'Session Required',
      description: 'You must be signed in to access this page.',
      severity: 'warning',
    },
    Default: {
      title: 'Authentication Error',
      description: 'An unexpected error occurred during authentication. Please try again.',
      severity: 'error',
    },
  };

  const errorInfo = errorMessages[error || 'Default'] || errorMessages.Default;
  const Icon = errorInfo.severity === 'error' ? AlertCircle : AlertTriangle;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Icon className={errorInfo.severity === 'error' ? 'h-6 w-6 text-red-600' : 'h-6 w-6 text-yellow-600'} />
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
          </div>
          <CardDescription>
            <span className="text-primary">Serene</span>Mind
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={errorInfo.severity === 'error' ? 'destructive' : 'default'}>
            <AlertTitle>{errorInfo.title}</AlertTitle>
            <AlertDescription>{errorInfo.description}</AlertDescription>
          </Alert>
          {error && (
            <p className="text-sm text-muted-foreground">
              Error code: <code className="bg-muted px-1 py-0.5 rounded">{error}</code>
            </p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">Go Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="max-w-md w-full p-8">
          <CardContent>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
