
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUser, LogIn, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useUser, useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { Icons } from "../icons";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

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

  const renderUserMenu = () => {
    if (isUserLoading) {
      return <Skeleton className="h-8 w-20 rounded-md" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
       <Button asChild variant="secondary" size="sm">
            <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
            </Link>
        </Button>
    );
  };

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 lg:h-[60px] lg:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
                <Menu />
                <span className="sr-only">Open Menu</span>
            </Button>
            <Link href={!isUserLoading && user ? "/dashboard" : "/"} className="flex items-center gap-2 group justify-center">
              <div
                className='h-20 w-40 relative'
              >
                <Icons.logo />
              </div>
            </Link>
        </div>
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search artists, tracks, albums..."
                className="w-full appearance-none bg-transparent pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        {renderUserMenu()}
      </header>
    </>
  );
}
