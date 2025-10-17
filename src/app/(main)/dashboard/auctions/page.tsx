
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import Link from "next/link";
import Image from "next/image";

export default function AuctionsPage() {
  useOnboarding('auctions');

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="relative h-12 w-48 mb-2">
                <Image 
                    src="https://i.ibb.co/fVjNMVpk/logo2.png" 
                    alt="Audio Exchange Logo"
                    fill
                    className="object-contain"
                />
            </div>
            <p className="mt-2 text-muted-foreground">
              Buy, sell, and trade music rights and royalties using VSD tokens.
            </p>
        </div>
        <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Listing
        </Button>
      </div>


      <Card className="w-full">
        <CardHeader>
          <CardTitle>Active Listings</CardTitle>
          <CardDescription>
            This feature is currently under active development. Soon, this will be a marketplace for music rights.
            Check out our <Link href="/roadmap" className="text-primary underline">public roadmap</Link> to see what&apos;s next.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-16">
           <div className="relative h-24 w-64 mb-6 opacity-50">
             <Image 
                src="https://i.ibb.co/fVjNMVpk/logo2.png" 
                alt="Audio Exchange Logo"
                fill
                className="object-contain"
            />
           </div>
          <p className="text-lg font-semibold">The Exchange is Warming Up</p>
          <p className="text-muted-foreground mt-2 max-w-md">
            Check back soon for active listings and the ability to trade rights and royalties.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
