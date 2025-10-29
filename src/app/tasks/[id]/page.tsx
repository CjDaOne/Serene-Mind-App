import { notFound } from 'next/navigation';
import AppShell from '@/components/app-shell';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Task Detail: {id}</h1>
        <p>Dynamic routing implemented. Task details would be displayed here.</p>
      </div>
    </AppShell>
  );
}
