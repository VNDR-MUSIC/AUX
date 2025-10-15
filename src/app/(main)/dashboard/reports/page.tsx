
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
import { BarChart, FileText, Download } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function ReportsPage() {
  // Although we don't have onboarding for this page yet, 
  // you can add 'reports' to useOnboarding if you create a tour for it.

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Analytics & Reports</h1>
        <p className="mt-2 text-muted-foreground">
          Dive deep into your music's performance and generate detailed reports.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generate Performance Report</CardTitle>
          <CardDescription>
            Get a comprehensive PDF report on your catalog's streams, listeners, and revenue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-16">
          <FileText className="h-24 w-24 text-muted-foreground/50 mb-6" />
          <p className="text-lg font-semibold">Unlock Actionable Insights</p>
          <p className="text-muted-foreground mt-2 max-w-md">
            Our AI-powered reporting engine analyzes your data to provide you with trends, demographic information, and revenue projections.
          </p>
           <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                Report generation costs 
                <span className="font-bold flex items-center gap-1">
                     <Link href="https://vsd.network" target="_blank" rel="noopener noreferrer"><Icons.vsd className="h-4 w-4"/></Link> 25
                </span>
                 VSD Lite tokens.
            </div>
        </CardContent>
        <CardFooter className="justify-center">
            <Button disabled>
                <Download className="mr-2 h-4 w-4" />
                Generate & Download Report (Coming Soon)
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
