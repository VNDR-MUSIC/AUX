
'use client';

import UploadForm from "@/components/upload/upload-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOnboarding } from "@/hooks/use-onboarding";
import { HardHat } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function UploadPage() {
  useOnboarding('upload');
  
  return (
    <div className="container mx-auto py-8">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Upload New Work</CardTitle>
          <CardDescription>
            Add a new work to your catalog. Provide the audio file and basic metadata to begin the enrichment process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <HardHat className="h-4 w-4" />
            <AlertTitle>Under Development</AlertTitle>
            <AlertDescription>
              The full automated processing pipeline (audio analysis, Muso.ai, ACRCloud) is being built. For now, uploading will save the work's metadata to your catalog.
            </AlertDescription>
          </Alert>
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
