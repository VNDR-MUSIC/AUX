
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { uploadTrackAction } from "@/app/actions/music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/firebase";

const initialUploadState = {
    message: null,
    errors: {},
}

function UploadButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
             {pending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
                <><UploadCloud className="mr-2 h-4 w-4" /> Upload & Process Work</>
            )}
        </Button>
    )
}

export default function UploadForm() {
  const [uploadState, uploadFormAction] = useActionState(uploadTrackAction, initialUploadState);
  const { user } = useUser();
  const { toast } = useToast();
  
  const mainFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (uploadState.message) {
        toast({
            title: uploadState.errors ? "Error" : "Success!",
            description: uploadState.message,
            variant: uploadState.errors ? "destructive" : "default",
        });
        if (!uploadState.errors) {
            mainFormRef.current?.reset();
        }
    }
  }, [uploadState, toast]);

  const artistName = user?.displayName || user?.email?.split('@')[0] || '';

  return (
    <>
      <form id="upload-track-form" action={uploadFormAction} ref={mainFormRef} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div className="grid gap-2">
                <Label htmlFor="trackTitle">Work Title</Label>
                <Input id="trackTitle" name="trackTitle" placeholder="e.g., Midnight Bloom" required />
                {uploadState.errors?.trackTitle && <p className="text-sm text-destructive">{uploadState.errors.trackTitle[0]}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="artistName">Artist Name</Label>
                        <Input id="artistName" name="artistName" defaultValue={artistName} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="genre">Primary Genre</Label>
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
                            <SelectItem value="Cinematic">Cinematic</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                </div>

                 <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea id="description" name="description" placeholder="Describe your track. Include mood, instrumentation, and potential use cases." />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="audio-file">Audio File</Label>
                <div className="flex justify-center items-center h-full rounded-lg border border-dashed border-input px-6 py-10">
                    <div className="text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label htmlFor="audio-file" className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80">
                                <span>Click to upload</span>
                                <input id="audio-file" name="audio-file" type="file" className="sr-only" required />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-500">MP3, WAV, FLAC up to 50MB</p>
                    </div>
                </div>
            </div>
        </div>
        
        <input type="hidden" name="artistId" value={user?.uid || ''} />
        {uploadState.errors?._form && <p className="text-sm text-destructive">{uploadState.errors._form[0]}</p>}
        <div className="flex justify-end pt-4">
            <UploadButton />
        </div>
      </form>
    </>
  );
}
