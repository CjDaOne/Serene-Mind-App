import AppShell from '@/components/app-shell';
import TaskManager from '@/components/tasks/task-manager';

export default function TasksPage() {
  return (
    <AppShell>
      <TaskManager />
    </AppShell>
  );
}
