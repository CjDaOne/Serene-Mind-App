import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(__dirname, "../..");

export default async function DataAgent(logFile: string) {
  fs.appendFileSync(logFile, "### Data Agent Tasks\n\n");

  // Task 1: Scan store.ts for MOCK data
  fs.appendFileSync(logFile, "1. **Scanning /lib/store.ts for MOCK data...**\n");

  const storePath = path.join(PROJECT_ROOT, "src/lib/store.ts");
  if (!fs.existsSync(storePath)) {
    fs.appendFileSync(logFile, "   ❌ /src/lib/store.ts not found.\n\n");
    return;
  }

  const storeContent = fs.readFileSync(storePath, 'utf8');

  if (storeContent.includes("MOCK_TASKS") ||
      storeContent.includes("MOCK_JOURNAL_ENTRIES") ||
      storeContent.includes("MOCK_ACHIEVEMENTS")) {
    fs.appendFileSync(logFile, "   ⚠️ Found mock data in store.ts\n");
    fs.appendFileSync(logFile, "   💡 Migration to React Query needed.\n\n");
  } else {
    fs.appendFileSync(logFile, "   ✅ No mock data found in store.ts\n\n");
    return; // No migration needed
  }

  // Task 2: Check if React Query is installed
  fs.appendFileSync(logFile, "2. **Checking React Query installation...**\n");

  const packageJsonPath = path.join(PROJECT_ROOT, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const hasReactQuery = packageJson.dependencies && (
    packageJson.dependencies["@tanstack/react-query"] ||
    packageJson.dependencies["react-query"]
  );

  if (!hasReactQuery) {
    fs.appendFileSync(logFile, "   ⚠️ React Query not installed.\n");
    fs.appendFileSync(logFile, "   💡 Install with: npm install @tanstack/react-query\n\n");
  } else {
    fs.appendFileSync(logFile, "   ✅ React Query is installed.\n\n");
  }

  // Task 3: Generate React Query hooks skeleton
  fs.appendFileSync(logFile, "3. **Generating React Query hooks skeleton...**\n");

  const hooksDir = path.join(PROJECT_ROOT, "src/hooks");
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir);
  }

  // Create task hooks
  const taskHooksContent = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@/lib/types';

// Mock API functions - replace with real API calls
const fetchTasks = async (): Promise<Task[]> => {
  // TODO: Replace with actual API call
  return [];
};

const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  // TODO: Replace with actual API call
  return { ...task, id: Date.now().toString() };
};

const updateTask = async (task: Task): Promise<Task> => {
  // TODO: Replace with actual API call
  return task;
};

const deleteTask = async (id: string): Promise<void> => {
  // TODO: Replace with actual API call
};

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};`;

  const taskHooksPath = path.join(hooksDir, "useTasks.ts");
  fs.writeFileSync(taskHooksPath, taskHooksContent);
  fs.appendFileSync(logFile, "   ✅ Created /src/hooks/useTasks.ts\n");

  // Create journal hooks
  const journalHooksContent = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { JournalEntry } from '@/lib/types';

// Mock API functions - replace with real API calls
const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
  // TODO: Replace with actual API call
  return [];
};

const createJournalEntry = async (entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
  // TODO: Replace with actual API call
  return { ...entry, id: Date.now().toString() };
};

export const useJournalEntries = () => {
  return useQuery({
    queryKey: ['journal'],
    queryFn: fetchJournalEntries,
  });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
    },
  });
};`;

  const journalHooksPath = path.join(hooksDir, "useJournal.ts");
  fs.writeFileSync(journalHooksPath, journalHooksContent);
  fs.appendFileSync(logFile, "   ✅ Created /src/hooks/useJournal.ts\n");

  // Task 4: Update providers to include React Query
  fs.appendFileSync(logFile, "\n4. **Updating providers for React Query...**\n");

  const providersPath = path.join(PROJECT_ROOT, "src/components/providers.tsx");
  if (fs.existsSync(providersPath)) {
    let providersContent = fs.readFileSync(providersPath, 'utf8');

    if (!providersContent.includes("QueryClient")) {
      const queryClientImport = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';`;
      const queryClientSetup = `
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});`;

      // Add imports
      providersContent = providersContent.replace(
        "import { ReactNode } from 'react';",
        `import { ReactNode } from 'react';
${queryClientImport}`
      );

      // Add QueryClient setup and provider
      providersContent = providersContent.replace(
        "interface ProvidersProps {\n  children: ReactNode;\n}\n\nexport function Providers({ children }: ProvidersProps) {\n  return (\n    <SessionProvider>\n      {children}\n    </SessionProvider>\n  );\n}",
        `interface ProvidersProps {\n  children: ReactNode;\n}

${queryClientSetup}

export function Providers({ children }: ProvidersProps) {\n  return (\n    <SessionProvider>\n      <QueryClientProvider client={queryClient}>\n        {children}\n      </QueryClientProvider>\n    </SessionProvider>\n  );\n}`
      );

      fs.writeFileSync(providersPath, providersContent);
      fs.appendFileSync(logFile, "   ✅ Updated /src/components/providers.tsx with React Query\n");
    } else {
      fs.appendFileSync(logFile, "   ✅ React Query already configured in providers\n");
    }
  } else {
    fs.appendFileSync(logFile, "   ❌ /src/components/providers.tsx not found\n");
  }

  fs.appendFileSync(logFile, "\n   ✅ Data Agent completed all tasks.\n");
  fs.appendFileSync(logFile, "   💡 Next: Replace mock API calls with real endpoints\n\n");
}
