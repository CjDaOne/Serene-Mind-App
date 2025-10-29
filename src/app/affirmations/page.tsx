import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/app-shell';
import AffirmationsClient from '@/components/affirmations/affirmations-client';

export const revalidate = 86400;

export default async function AffirmationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <AppShell>
      <AffirmationsClient />
    </AppShell>
  );
}
