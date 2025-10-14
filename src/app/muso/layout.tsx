
import Footer from "@/components/layout/footer";
import { Icons } from "@/components/icons";
import Link from "next/link";
import React from "react";

export default function MusoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <div className="relative h-10 w-20">
                    <Icons.logo />
                </div>
                 <span className="font-light sm:inline-block font-headline text-lg text-muted-foreground">
                    + Muso.AI
                </span>
            </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
