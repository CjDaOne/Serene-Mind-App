import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/app-shell';
import RewardsClient from '@/components/rewards/rewards-client';

export default async function RewardsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <AppShell>
      <RewardsClient />
    </AppShell>
  );
}
