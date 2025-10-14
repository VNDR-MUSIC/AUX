
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Upload,
  Library,
  FileText,
  DollarSign,
  Settings,
  Gavel,
} from "lucide-react";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Icons } from "../icons";
import AnimatedGradientText from "../animated-gradient-text";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/upload", icon: Upload, label: "Upload" },
  { href: "/dashboard/catalog", icon: Library, label: "Catalog" },
  { href: "/dashboard/licensing", icon: FileText, label: "Licensing" },
  { href: "/dashboard/auctions", icon: Gavel, label: "Auctions" },
  { href: "/vsd-demo", icon: DollarSign, label: "VSD Demo" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 group">
           <div className={cn(
            "h-10 w-10 rounded-lg p-1",
            "bg-gradient-to-r from-[#8A2BE2] via-[#FF69B4] to-[#FF0000]",
            "animate-gradient-animation bg-[length:200%_200%]"
            )}>
                <div className="flex h-full w-full items-center justify-center rounded-md bg-sidebar">
                    <Icons.logo className="h-6 w-6 text-primary group-data-[collapsible=icon]:text-primary"/>
                </div>
            </div>
          <div className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">
            <AnimatedGradientText>VNDR</AnimatedGradientText>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
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
      </SidebarContent>
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
    </>
  );
}
