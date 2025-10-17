
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Handshake } from "lucide-react";
import Link from "next/link";
import { useOnboarding } from "@/hooks/use-onboarding";

export default function LicensingPage() {
    useOnboarding('licensing');

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Licensing Marketplace</h1>
        <p className="mt-2 text-muted-foreground">
          Monetize your catalog through our automated licensing marketplace.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
          <CardDescription>
            Our Audio Exchange marketplace is under construction. Soon, you will be able to license your music through instant and negotiated deals, with dynamic pricing based on real-world data.
            Check out our <Link href="/roadmap" className="text-primary underline">public roadmap</Link> to see what's next.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-16">
          <Handshake className="h-24 w-24 text-muted-foreground/50 mb-6" />
          <p className="text-lg font-semibold">The Marketplace is Being Assembled</p>
          <p className="text-muted-foreground mt-2 max-w-md">
            Check back soon to discover a new, transparent way to monetize your music.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
