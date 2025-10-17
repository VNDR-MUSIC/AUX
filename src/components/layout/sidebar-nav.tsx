
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
  Scale,
  Shield,
  BarChart,
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
import { useMemo } from 'react';

const authenticatedMenuItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
  { href: '/dashboard/catalog', icon: Library, label: 'Catalog' },
  { href: '/dashboard/licensing', icon: FileText, label: 'Licensing' },
  { href: '/dashboard/auctions', icon: Gavel, label: 'Auctions' },
  { href: '/dashboard/reports', icon: BarChart, label: 'Reports' },
  { href: '/dashboard/legal-eagle', icon: Scale, label: 'Legal Eagle' },
];

const publicMenuItems = [
  { href: '/vsd-demo', icon: DollarSign, label: 'VSD Demo' },
];

const adminMenuItem = { href: '/admin', icon: Shield, label: 'Admin' };


export default function SidebarNav() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const isAdmin = (user as any)?.customClaims?.admin === true;

  const menuItems = useMemo(() => {
    let items = user ? [...authenticatedMenuItems] : [...publicMenuItems];
    if (user && isAdmin) {
      items.push(adminMenuItem);
    }
    return items;
  }, [user, isAdmin]);

  return (
    <>
      <SidebarHeader>
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group justify-center">
          <div
            className={cn(
              'h-20 w-40 relative'
            )}
          >
            <Icons.logo />
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
