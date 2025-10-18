'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VsdTestPage() {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setResponse(null);
    setIsError(false);

    const mockPayload = {
      fromAddress: '0xTestProject',
      toAddress: '0xVSDNetwork',
      amount: 1,
      description: 'Connection test from external project',
    };

    try {
      const res = await fetch('/api/vsd-bridge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'An unknown error occurred');
      }

      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch';
      setResponse(JSON.stringify({ error: errorMessage }, null, 2));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            VSD Network Connection Test
          </CardTitle>
          <CardDescription>
            Click the button to send a test transaction to the VSD Network via
            the API bridge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Test Payload</AlertTitle>
            <AlertDescription>
              <pre className="text-xs whitespace-pre-wrap font-mono mt-2">
                {JSON.stringify(
                  {
                    fromAddress: '0xTestProject',
                    toAddress: '0xVSDNetwork',
                    amount: 1,
                    description: 'Connection test from external project',
                  },
                  null,
                  2
                )}
              </pre>
            </AlertDescription>
          </Alert>

          {response && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">API Response:</h4>
              <pre
                className={`text-xs whitespace-pre-wrap font-mono p-4 rounded-md ${
                  isError ? 'bg-destructive/10 text-destructive' : 'bg-muted'
                }`}
              >
                {response}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleTestConnection}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? 'Running Test...' : 'Run Connection Test'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
