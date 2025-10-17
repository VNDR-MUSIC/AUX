
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
import { Gavel } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import Link from "next/link";

export default function AuctionsPage() {
  useOnboarding('auctions');

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Contracts & Splits</h1>
        <p className="mt-2 text-muted-foreground">
          Draft, manage, and approve contracts and split agreements.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
          <CardDescription>
            Our automated contract and split management system is under construction. Soon you&apos;ll be able to use Vertex AI to draft agreements and manage them with collaborators.
            Check out our <Link href="/roadmap" className="text-primary underline">public roadmap</Link> to see what&apos;s next.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-16">
          <Gavel className="h-24 w-24 text-muted-foreground/50 mb-6" />
          <p className="text-lg font-semibold">The Legal Engine is Warming Up</p>
          <p className="text-muted-foreground mt-2 max-w-md">
            Check back soon for automated contract drafting and management.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
            <Button disabled>Draft New Contract</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
