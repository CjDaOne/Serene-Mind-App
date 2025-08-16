'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { BrainCircuit } from 'lucide-react';
import { MainNav } from './main-nav';
import Link from 'next/link';
import { useSidebar } from './ui/sidebar';

function MobileHeader() {
  const { open, setOpen } = useSidebar();
  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b">
      <Link href="/" className="flex items-center gap-2">
        <BrainCircuit className="w-6 h-6 text-primary" />
        <span className="font-headline font-bold text-primary">SereneMind</span>
      </Link>
      <SidebarTrigger />
    </header>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-background min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between p-4">
              <Link href="/" className="flex items-center gap-2">
                 <BrainCircuit className="w-8 h-8 text-primary" />
                 <h1 className="text-xl font-headline font-bold text-primary">
                    SereneMind
                 </h1>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <MobileHeader />
          <div className="hidden md:block p-4">
            <SidebarTrigger />
          </div>
          <main className="p-4 sm:p-6 lg:p-8 pt-0 md:pt-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
