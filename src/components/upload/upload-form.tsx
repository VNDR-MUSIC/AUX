"use client";

import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { generateCoverArtAction } from "@/app/actions/music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const initialState = {
  message: null,
  coverArtDataUri: null,
  errors: {},
};

function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      {pending ? "Generating..." : "Generate AI Cover Art"}
    </Button>
  );
}

export default function UploadForm() {
  const [state, formAction] = useFormState(generateCoverArtAction, initialState);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.errors ? "Error" : "Success",
        description: state.message,
        variant: state.errors ? "destructive" : "default",
      });
    }
  }, [state, toast]);
  
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 95) {
                clearInterval(interval);
                return 100;
            }
            return prev + 5;
        });
    }, 200);

    setTimeout(() => {
        setIsUploading(false);
        toast({
            title: "Upload Complete!",
            description: "Your track has been successfully uploaded."
        });
    }, 4500);
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <form ref={formRef} action={formAction} className="md:col-span-2 grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="trackTitle">Track Title</Label>
          <Input id="trackTitle" name="trackTitle" placeholder="e.g., Midnight Bloom" required />
          {state.errors?.trackTitle && <p className="text-sm text-destructive">{state.errors.trackTitle[0]}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="artistName">Artist Name</Label>
            <Input id="artistName" name="artistName" placeholder="e.g., Synthwave Samurai" defaultValue="Synthwave Samurai" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="genre">Genre</Label>
             <Select name="genre" required>
                <SelectTrigger id="genre">
                    <SelectValue placeholder="Select a genre"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Synthwave">Synthwave</SelectItem>
                    <SelectItem value="Lofi Hip-Hop">Lofi Hip-Hop</SelectItem>
                    <SelectItem value="Future Funk">Future Funk</SelectItem>
                    <SelectItem value="Ambient">Ambient</SelectItem>
                    <SelectItem value="Electronic">Electronic</SelectItem>
                </SelectContent>
            </Select>
            {state.errors?.genre && <p className="text-sm text-destructive">{state.errors.genre[0]}</p>}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea id="description" name="description" placeholder="Add a short description about your track."/>
        </div>

        <div>
            <Label htmlFor="audio-file">Audio File</Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="audio-file" className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80">
                            <span>Upload a file</span>
                            <input id="audio-file" name="audio-file" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-500">MP3, WAV, FLAC up to 25MB</p>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-2">
            <GenerateButton />
        </div>
      </form>

      <div className="space-y-4">
        <Label>Cover Art Preview</Label>
        <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center border border-dashed">
            {state.coverArtDataUri ? (
                <Image src={state.coverArtDataUri} alt="Generated Cover Art" width={400} height={400} className="rounded-lg object-cover" />
            ) : (
                 <div className="text-center text-muted-foreground p-4">
                    <Wand2 className="mx-auto h-12 w-12"/>
                    <p className="mt-2 text-sm">Generated art will appear here.</p>
                 </div>
            )}
        </div>
        <form onSubmit={handleUpload}>
            <Button className="w-full" type="submit" disabled={isUploading || !state.coverArtDataUri}>
                {isUploading ? "Uploading..." : "Upload Track & Finalize"}
            </Button>
            {isUploading && (
                <div className="mt-2 space-y-1">
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-center text-muted-foreground">{uploadProgress}%</p>
                </div>
            )}
        </form>
      </div>
    </div>
  );
}
