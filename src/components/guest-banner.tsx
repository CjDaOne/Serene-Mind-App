'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-md relative">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900">You're in Demo Mode</h3>
          <p className="text-sm text-amber-800 mt-1">
            You're exploring with demo data. Create an account to save your progress and unlock all features!
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => router.push('/auth/signin')}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Create Account
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDismissed(true)}
            >
              Continue Demo
            </Button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-800 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
