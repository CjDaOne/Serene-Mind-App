'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CloudOff } from 'lucide-react';

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-lg">
        <div className="flex justify-center">
          <div className="rounded-full bg-purple-100 p-6">
            <CloudOff className="h-16 w-16 text-purple-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            You&apos;re Offline
          </h1>
          <p className="text-gray-600">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry, your data is safe and will sync when you&apos;re back online.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleRetry}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Try Again
          </Button>
          
          <p className="text-sm text-gray-500">
            Some features may be limited while offline, but you can still view your previously loaded content.
          </p>
        </div>
      </Card>
    </div>
  );
}
