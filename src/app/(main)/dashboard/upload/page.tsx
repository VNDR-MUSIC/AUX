import UploadForm from "@/components/upload/upload-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Upload Your Music</CardTitle>
          <CardDescription>
            Add a new track to your library. Fill in the details and generate AI-powered cover art.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
