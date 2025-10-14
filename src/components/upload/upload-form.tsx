"use client";

import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { generateCoverArtAction, recommendLicensingPriceAction } from "@/app/actions/music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Info, Loader2, Wand2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icons } from "../icons";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";


const initialCoverArtState = {
  message: null,
  coverArtDataUri: null,
  errors: {},
};

const initialLicensingState = {
    message: null,
    recommendedPrice: null,
    justification: null,
    errors: {},
};

function GenerateCoverArtButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} form="cover-art-form">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      {pending ? "Generating..." : "Generate AI Cover Art"}
    </Button>
  );
}

function RecommendPriceButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" variant="outline" disabled={pending} form="licensing-price-form">
        {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
            <Wand2 className="mr-2 h-4 w-4" />
        )}
        {pending ? "Analyzing..." : "Get AI Recommendation"}
        </Button>
    );
}

export default function UploadForm() {
  const [coverArtState, coverArtFormAction] = useFormState(generateCoverArtAction, initialCoverArtState);
  const [licensingState, licensingFormAction] = useFormState(recommendLicensingPriceAction, initialLicensingState);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [pricingOption, setPricingOption] = useState("ai");
  const [manualPrice, setManualPrice] = useState("");
  const { toast } = useToast();

  const coverArtFormRef = useRef<HTMLFormElement>(null);
  const licensingFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (coverArtState.message) {
      toast({
        title: coverArtState.errors ? "Error" : "Success",
        description: coverArtState.message,
        variant: coverArtState.errors ? "destructive" : "default",
      });
    }
  }, [coverArtState, toast]);

  useEffect(() => {
    if(licensingState.message && !licensingState.errors) {
        toast({
            title: "Recommendation Ready",
            description: licensingState.message,
        });
    } else if (licensingState.message && licensingState.errors) {
        toast({
            title: "Error",
            description: licensingState.message,
            variant: "destructive",
        });
    }
  }, [licensingState, toast]);
  
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
        <div className="md:col-span-2 space-y-6">
            {/* Combined form for hidden inputs */}
            <form ref={coverArtFormRef} id="cover-art-form" action={coverArtFormAction} className="hidden"></form>
            <form ref={licensingFormRef} id="licensing-price-form" action={licensingFormAction} className="hidden"></form>

            <div className="grid gap-2">
                <Label htmlFor="trackTitle">Track Title</Label>
                <Input id="trackTitle" name="trackTitle" placeholder="e.g., Midnight Bloom" required form="cover-art-form"/>
                {coverArtState.errors?.trackTitle && <p className="text-sm text-destructive">{coverArtState.errors.trackTitle[0]}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="artistName">Artist Name</Label>
                    <Input id="artistName" name="artistName" placeholder="e.g., Synthwave Samurai" defaultValue="Synthwave Samurai" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Select name="genre" required form="cover-art-form">
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
                    {coverArtState.errors?.genre && <p className="text-sm text-destructive">{coverArtState.errors.genre[0]}</p>}
                    {/* Hidden input for licensing form */}
                    <input type="hidden" name="genre" value={coverArtFormRef.current?.genre?.value} form="licensing-price-form" />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" placeholder="Add a short description about your track. This helps the AI generate better cover art and pricing." form="cover-art-form"/>
                 {/* Hidden input for licensing form */}
                <input type="hidden" name="description" value={coverArtFormRef.current?.description?.value} form="licensing-price-form" />
            </div>

            <div className="grid gap-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Licensing & Pricing</h3>
                <RadioGroup value={pricingOption} onValueChange={setPricingOption} className="flex flex-col sm:flex-row gap-4">
                    <Label htmlFor="pricing-ai" className="flex-1 flex items-center gap-2 p-4 border rounded-md has-[:checked]:border-primary cursor-pointer">
                        <RadioGroupItem value="ai" id="pricing-ai"/>
                        <span>Help me choose a price (AI-powered)</span>
                    </Label>
                    <Label htmlFor="pricing-manual" className="flex-1 flex items-center gap-2 p-4 border rounded-md has-[:checked]:border-primary cursor-pointer">
                        <RadioGroupItem value="manual" id="pricing-manual"/>
                        <span>Set my own price</span>
                    </Label>
                </RadioGroup>

                {pricingOption === 'ai' && (
                    <div className="space-y-4">
                        <RecommendPriceButton />
                        {licensingState.recommendedPrice && licensingState.justification && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle className="flex items-center gap-2">
                                    <span>AI Price Suggestion:</span> 
                                    <span className="font-bold flex items-center gap-1"><Icons.vsd className="h-4 w-4"/> {licensingState.recommendedPrice} VSD</span>
                                </AlertTitle>
                                <AlertDescription>
                                    {licensingState.justification}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}

                {pricingOption === 'manual' && (
                    <div className="grid gap-2">
                        <Label htmlFor="manual-price">Licensing Price (VSD)</Label>
                        <div className="relative">
                            <Icons.vsd className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input id="manual-price" type="number" placeholder="e.g., 250" className="pl-9" value={manualPrice} onChange={(e) => setManualPrice(e.target.value)} />
                        </div>
                    </div>
                )}
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
                <GenerateCoverArtButton />
            </div>
        </div>

        <div className="space-y-4">
            <Label>Cover Art Preview</Label>
            <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center border border-dashed">
                {coverArtState.coverArtDataUri ? (
                    <Image src={coverArtState.coverArtDataUri} alt="Generated Cover Art" width={400} height={400} className="rounded-lg object-cover" />
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <Wand2 className="mx-auto h-12 w-12"/>
                        <p className="mt-2 text-sm">Generated art will appear here.</p>
                    </div>
                )}
            </div>
            <form onSubmit={handleUpload}>
                <Button className="w-full" type="submit" disabled={isUploading || !coverArtState.coverArtDataUri}>
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
