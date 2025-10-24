import { notFound } from 'next/navigation';
import AppShell from '@/components/app-shell';
import { useTaskStore } from '@/lib/store';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  // Note: Since Zustand is client-side, we can't directly access it in server component.
  // For now, this is a placeholder. In real app, fetch from DB or pass via props.

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Task Detail: {id}</h1>
        <p>Dynamic routing implemented. Task details would be displayed here using global state.</p>
      </div>
    </AppShell>
  );
}
