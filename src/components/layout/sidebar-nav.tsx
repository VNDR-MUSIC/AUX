
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Upload,
  Library,
  FileText,
  DollarSign,
  Settings,
  Gavel,
  BrainCircuit,
} from 'lucide-react';
import { useUser } from '@/firebase';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const authenticatedMenuItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
  { href: '/dashboard/catalog', icon: Library, label: 'Catalog' },
  { href: '/dashboard/licensing', icon: FileText, label: 'Licensing' },
  { href: '/dashboard/auctions', icon: Gavel, label: 'Auctions' },
];

const publicMenuItems = [
  { href: '/vsd-demo', icon: DollarSign, label: 'VSD Demo' },
  { href: '/symbi', icon: BrainCircuit, label: 'Symbi' },
];


export default function SidebarNav() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  const menuItems = user ? authenticatedMenuItems : publicMenuItems;

  return (
    <>
      <SidebarHeader>
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div
            className={cn(
              'h-10 w-10 rounded-lg p-1 bg-primary text-primary-foreground flex items-center justify-center'
            )}
          >
            <Icons.logo className="h-6 w-6" />
          </div>
          <div className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">
            <span className="text-foreground">VNDR</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {isUserLoading ? (
            <div className='p-2 space-y-2'>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        ) : (
            <SidebarMenu>
                {menuItems.map(item => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                    asChild
                    isActive={
                        pathname.startsWith(item.href) &&
                        (item.href !== '/dashboard' || pathname === '/dashboard')
                    }
                    tooltip={{ children: item.label }}
                    >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        )}
      </SidebarContent>
      {user && (
         <SidebarFooter>
            <SidebarSeparator />
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{children: "Settings"}} isActive={pathname.startsWith('/dashboard/settings')}>
                        <Link href="/dashboard/settings">
                            <Settings/>
                            <span>Settings</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      )}
    </>
  );
}
