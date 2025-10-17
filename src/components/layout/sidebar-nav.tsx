
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Library,
  FileText,
  Shield,
  BarChart,
  Wallet,
  Gavel,
  Scale,
  DollarSign,
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
import { useRouter } from 'next/navigation';


const authenticatedMenuItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/my-works', icon: Library, label: 'My Works' },
  { href: '/dashboard/licensing', icon: FileText, label: 'Licensing' },
  { href: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/dashboard/auctions', icon: Gavel, label: 'Auctions' },
  { href: '/dashboard/reports', icon: BarChart, label: 'Analytics' },
  { href: '/dashboard/legal-eagle', icon: Scale, label: 'Legal Eagle' },
  { href: '/vsd-demo', icon: DollarSign, label: 'VSD Demo' },
];

const adminMenuItem = { href: '/admin', icon: Shield, label: 'Admin' };


export default function SidebarNav() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const isAdmin = (user as any)?.customClaims?.admin === true;

  const menuItems = useMemo(() => {
    let items = user ? [...authenticatedMenuItems] : [];
    if (user && isAdmin) {
      items.push(adminMenuItem);
    }
    return items;
  }, [user, isAdmin]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
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
                        item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
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
                  <Link href={`/profile/${user.uid}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
      )}
    </>
  );
}
