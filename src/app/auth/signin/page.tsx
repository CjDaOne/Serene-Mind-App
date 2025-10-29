'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Sparkles } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn('email', { email, redirect: false });
      setEmailSent(true);
    } catch (error) {
      console.error('Email sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to Serene Mind</CardTitle>
          <CardDescription className="text-base">
            Sign in to start your mental wellness journey
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google" className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Continue with your Google account
              </div>
              <Button 
                onClick={handleGoogleSignIn} 
                variant="outline" 
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              {emailSent ? (
                <div className="text-center space-y-3 py-6">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve sent a magic link to <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click the link in the email to sign in
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    className="mt-4"
                  >
                    Try a different email
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center text-sm text-muted-foreground mb-4">
                    Get a magic link sent to your inbox
                  </div>
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 text-base"
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Sending magic link...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-5 w-5" />
                          Send magic link
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
