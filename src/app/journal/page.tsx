import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/app-shell';
import JournalClient from '@/components/journal/journal-client';

export default async function JournalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <AppShell>
      <JournalClient />
    </AppShell>
  );
}
