'use client';

import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { Award, BookText, Calendar, CheckSquare, LayoutDashboard, Sparkles } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: ' /journal', label: 'Journal', icon: BookText },
  { href: '/rewards', label: 'Rewards', icon: Award },
  { href: '/affirmations', label: 'Affirmations', icon: Sparkles },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
            <Link href={item.href} className="w-full">
                <SidebarMenuButton 
                    isActive={pathname === item.href}
                    tooltip={item.label}
                >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
