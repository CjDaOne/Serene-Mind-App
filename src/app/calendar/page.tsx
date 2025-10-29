import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/app-shell';
import CalendarClient from '@/components/calendar/calendar-client';

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <AppShell>
      <CalendarClient />
    </AppShell>
  );
}
