
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function VsdDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // In a real app, the API key should be stored securely in an environment variable
      // and this call would be made from a server-side action for security.
      const apiKey = process.env.NEXT_PUBLIC_VSD_INTERNAL_API_KEY || "supersecretkey";

      const response = await fetch('/api/vsd-bridge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          trackId: 'track_123',
          amount: 10,
          currency: 'VSD'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Transaction failed');
      }

      toast({
        title: "Purchase Successful!",
        description: `Transaction ID: ${result.transactionId}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trackImage = PlaceHolderImages.find(img => img.id === 'album-4');

  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">VSD Token Purchase</CardTitle>
          <CardDescription>
            Purchase music using your VSD tokens via our secure bridge.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            {trackImage && (
              <Image
                src={trackImage.imageUrl}
                alt="Neon Drive"
                width={80}
                height={80}
                className="rounded-md"
                data-ai-hint={trackImage.imageHint}
              />
            )}
            <div className="flex-1 space-y-1">
              <p className="text-lg font-medium leading-none">
                Neon Drive
              </p>
              <p className="text-sm text-muted-foreground">
                Future Funksters
              </p>
            </div>
            <Badge variant="secondary" className="text-lg flex items-center gap-2">
              <Link href="https://vsd.network" target="_blank" rel="noopener noreferrer"><Icons.vsd className="h-4 w-4" /></Link>
              <span>10</span>
            </Badge>
          </div>
          <div className="font-code text-sm bg-muted p-4 rounded-md">
            <p className="font-bold text-muted-foreground">// Smart Contract Interaction Details</p>
            <p><span className="text-primary">Contract:</span> 0x123...abc</p>
            <p><span className="text-primary">Function:</span> purchaseTrack()</p>
            <p><span className="text-primary">Params:</span> (trackId: &quot;neon_drive_01&quot;, amount: 10)</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePurchase} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Link href="https://vsd.network" target="_blank" rel="noopener noreferrer"><Icons.vsd className="h-5 w-5" /></Link>
            )}
            {isLoading ? 'Processing...' : 'Purchase with VSD'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
