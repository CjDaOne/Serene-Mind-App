import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/app-shell';
import TaskManager from '@/components/tasks/task-manager';

export default async function TasksPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <AppShell>
      <TaskManager />
    </AppShell>
  );
}
