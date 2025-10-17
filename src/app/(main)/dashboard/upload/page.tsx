
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
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
