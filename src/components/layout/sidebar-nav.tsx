
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Library,
  FileText,
  Shield,
  BarChart,
  Wallet,
  Gavel,
  Scale,
  Settings,
  Users,
  LogOut,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';


const authenticatedMenuItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/my-works', icon: Library, label: 'My Works' },
  { href: '/dashboard/licensing', icon: FileText, label: 'Licensing' },
  { href: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/dashboard/auctions', icon: Gavel, label: 'Auctions' },
  { href: '/dashboard/reports', icon: BarChart, label: 'Analytics' },
  { href: '/dashboard/legal-eagle', icon: Scale, label: 'Legal Eagle' },
];

const publicMenuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/catalog', icon: Library, label: 'Music Catalog' },
]

const adminMenuItem = { href: '/admin', icon: Shield, label: 'Admin' };


export default function SidebarNav() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const isAdmin = (user as any)?.customClaims?.admin === true;

  const menuItems = useMemo(() => {
    if (isUserLoading) return [];
    let items = user ? [...authenticatedMenuItems] : [...publicMenuItems];
    if (user && isAdmin) {
      items.push(adminMenuItem);
    }
    return items;
  }, [user, isAdmin, isUserLoading]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push("/");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

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
                <Skeleton className="h-8 w-full" />
            </div>
        ) : (
            <SidebarMenu>
                {menuItems.map(item => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                    asChild
                    isActive={
                        // Handle special case for root dashboard route
                        item.href === '/dashboard' ? pathname === item.href :
                        // Handle case for base / route
                        item.href === '/' ? pathname === item.href :
                        // Default case for all other routes
                        pathname.startsWith(item.href)
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
      <SidebarFooter>
            <SidebarSeparator />
            {isUserLoading ? (
                 <div className="flex items-center gap-3 p-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            ) : user ? (
                <>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start w-full p-2 h-auto">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="text-left leading-tight truncate">
                                <p className="font-semibold text-sm truncate">{user.displayName || user.email}</p>
                            </div>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.uid}`}><Users className="mr-2 h-4 w-4" />Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
                </>
            ) : (
                 <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/login">
                                <Users />
                                <span>Login / Sign Up</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            )}
        </SidebarFooter>
    </>
  );
}
