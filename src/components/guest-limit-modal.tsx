'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GuestLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType: 'tasks' | 'journals';
  currentCount: number;
  maxCount: number;
}

export function GuestLimitModal({
  open,
  onOpenChange,
  limitType,
  currentCount,
  maxCount,
}: GuestLimitModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push('/auth/signin');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <DialogTitle>Demo Limit Reached</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            You've reached the demo limit of {maxCount} {limitType}. Create a free account to unlock unlimited {limitType} and save your progress!
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-2">
          <p className="text-sm text-amber-900">
            <strong>Demo Limitations:</strong>
          </p>
          <ul className="text-sm text-amber-800 mt-2 space-y-1 ml-4 list-disc">
            <li>Maximum 5 tasks</li>
            <li>Maximum 3 journal entries</li>
            <li>Data not saved (30-minute session)</li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Continue Demo
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            Create Free Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
