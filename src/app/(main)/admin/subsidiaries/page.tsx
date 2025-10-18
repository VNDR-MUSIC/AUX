
'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, KeyRound, Copy, Link as LinkIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function SubsidiaryPage() {
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const apiKey = process.env.NEXT_PUBLIC_VSD_INTERNAL_API_KEY || "supersecretkey";

  const isAdmin = (user as any)?.admin === true;

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard.",
    });
  };

  const exampleFetchCode = `
const response = await fetch('https://your-vndr-app-url.apphosting.dev/api/vsd-bridge', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${process.env.VSD_INTERNAL_API_KEY}\`,
  },
  body: JSON.stringify({
    trackId: 'track_123',
    amount: 10,
    currency: 'VSD'
  }),
});

const result = await response.json();
console.log(result);
  `;

  if (isUserLoading) {
      return (
        <div className="container mx-auto py-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-96 w-full" />
        </div>
      )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center text-center">
        <ShieldX className="h-24 w-24 text-destructive mb-4" />
        <h1 className="font-headline text-4xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter md:text-5xl">Subsidiary Integration</h1>
            <p className="mt-2 text-muted-foreground">Use this information to connect other platforms to the VNDR ecosystem.</p>
        </div>
        <Button asChild variant="outline">
            <Link href="/admin/subsidiary-status">
                <LinkIcon className="mr-2 h-4 w-4" />
                View Subsidiary Status
            </Link>
        </Button>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound /> Internal API Key</CardTitle>
            <CardDescription>This is the shared secret key for authorizing server-to-server communication between platforms. Keep it secure.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted font-mono text-sm">
                <span className="flex-1 truncate">{apiKey}</span>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(apiKey)}>
                    <Copy className="h-4 w-4" />
                </Button>
             </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>API Endpoints & Payloads</CardTitle>
                <CardDescription>Here are the endpoints this VNDR platform exposes for internal use.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold">VSD Token Bridge</h4>
                    <p className="text-sm text-muted-foreground mb-2">Endpoint for processing transactions via the VSD Network.</p>
                    <div className="font-mono text-xs bg-muted p-2 rounded-md">
                        <span className="font-bold text-primary">POST</span> /api/vsd-bridge
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold">Example: Node.js `fetch` Request</h4>
                    <p className="text-sm text-muted-foreground mb-2">Use this code in your subsidiary's Cloud Function to call the VNDR API.</p>
                    <Alert>
                        <AlertTitle>Example Code</AlertTitle>
                        <AlertDescription>
                            <pre className="text-xs whitespace-pre-wrap font-mono relative">
                                {exampleFetchCode}
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopyToClipboard(exampleFetchCode)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </pre>
                        </AlertDescription>
                    </Alert>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
