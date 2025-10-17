
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { uploadTrackAction } from "@/app/actions/music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, UploadCloud, Wand2, File as FileIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/firebase";
import { generateCoverArt } from "@/ai/flows/ai-cover-art-generation";
import { recommendLicensingPrice } from "@/ai/flows/ai-licensing-price-recommendation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Icons } from "../icons";
import { Progress } from "../ui/progress";
import { useFormStatus } from "react-dom";

const initialUploadState = {
    message: null,
    errors: {},
}

function UploadButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending} size="lg">
             {pending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
                <><UploadCloud className="mr-2 h-4 w-4" /> Upload & Process Work</>
            )}
        </Button>
    )
}

function UploadProgress() {
    const { pending } = useFormStatus();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (pending) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return 95;
                    }
                    return prev + 5;
                });
            }, 200);
            return () => clearInterval(interval);
        } else {
            setProgress(0);
        }
    }, [pending]);
    
    if (!pending) return null;

    return <Progress value={progress} className="w-full" />;
}

export default function UploadForm() {
  const [uploadState, uploadFormAction] = useActionState(uploadTrackAction, initialUploadState);
  const { user } = useUser();
  const { toast } = useToast();
  
  const mainFormRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [trackTitle, setTrackTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isArtLoading, setIsArtLoading] = useState(false);
  const [coverArtDataUri, setCoverArtDataUri] = useState<string | null>(null);

  const [priceOption, setPriceOption] = useState('recommend');
  const [manualPrice, setManualPrice] = useState('');
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [recommendedPrice, setRecommendedPrice] = useState<number | null>(null);

  useEffect(() => {
    if (uploadState.message) {
        toast({
            title: uploadState.errors ? "Error" : "Success!",
            description: uploadState.message,
            variant: uploadState.errors ? "destructive" : "default",
        });
        if (!uploadState.errors) {
            mainFormRef.current?.reset();
            setCoverArtDataUri(null);
            setTrackTitle('');
            setGenre('');
            setRecommendedPrice(null);
            setManualPrice('');
            setSelectedFile(null);
        }
    }
  }, [uploadState, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleGenerateArt = async () => {
    if (!trackTitle || !genre) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please provide a track title and genre before generating art.",
        });
        return;
    }
    setIsArtLoading(true);
    try {
        const result = await generateCoverArt({ trackTitle, genre });
        setCoverArtDataUri(result.coverArtDataUri);
    } catch(e) {
        console.error(e);
        toast({ variant: "destructive", title: "Art Generation Failed", description: "Could not generate cover art. Please try again."})
    } finally {
        setIsArtLoading(false);
    }
  }

  const handleRecommendPrice = async () => {
    if (!genre) {
        toast({
            variant: "destructive",
            title: "Missing Genre",
            description: "Please select a genre before recommending a price.",
        });
        return;
    }
    setIsPriceLoading(true);
    try {
        const result = await recommendLicensingPrice({ genre, description });
        setRecommendedPrice(result.recommendedPrice);
        toast({ title: "Price Recommended!", description: result.justification });
    } catch (e) {
        console.error(e);
        toast({ variant: "destructive", title: "Price Recommendation Failed", description: "Could not get a price recommendation. Please try again."})
    } finally {
        setIsPriceLoading(false);
    }
  };

  const artistName = user?.displayName || user?.email?.split('@')[0] || '';

  return (
    <>
      <form id="upload-track-form" action={uploadFormAction} ref={mainFormRef} className="space-y-6">
        <div className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="trackTitle">Work Title</Label>
                <Input id="trackTitle" name="trackTitle" placeholder="e.g., Midnight Bloom" required value={trackTitle} onChange={(e) => setTrackTitle(e.target.value)} />
                {uploadState.errors?.trackTitle && <p className="text-sm text-destructive">{uploadState.errors.trackTitle[0]}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="artistName">Artist Name</Label>
                    <Input id="artistName" name="artistName" defaultValue={artistName} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="genre">Primary Genre</Label>
                    <Select name="genre" required value={genre} onValueChange={setGenre}>
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
                <Textarea id="description" name="description" placeholder="Describe your track. Include mood, instrumentation, and potential use cases." value={description} onChange={e => setDescription(e.target.value)} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="audio-file">Audio File</Label>
                <div className="flex justify-center items-center h-full rounded-lg border border-dashed border-input px-6 py-10">
                    <div className="text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label htmlFor="audio-file" className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80">
                                <span>Click to upload</span>
                                <input id="audio-file" name="audio-file" type="file" className="sr-only" required onChange={handleFileChange} ref={fileInputRef} accept="audio/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-500">MP3, WAV, FLAC up to 50MB</p>
                    </div>
                </div>
                {selectedFile && (
                    <div className="mt-2 flex items-center justify-between rounded-lg border bg-muted p-2 text-sm">
                        <div className="flex items-center gap-2 truncate">
                            <FileIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{selectedFile.name}</span>
                            <span className="text-muted-foreground text-xs shrink-0">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleRemoveFile}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <Label>Cover Art</Label>
                <Card className="h-full flex flex-col items-center justify-center p-4 gap-4">
                    <div className="aspect-square w-full max-w-[200px] bg-muted rounded-md relative overflow-hidden">
                        {isArtLoading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        )}
                        {coverArtDataUri ? (
                            <Image src={coverArtDataUri} alt="AI Generated Cover Art" fill />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                AI Art Preview
                            </div>
                        )}
                    </div>
                    <Button variant="outline" className="w-full" type="button" onClick={handleGenerateArt} disabled={isArtLoading}>
                        {isArtLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate with AI
                    </Button>
                </Card>
            </div>
        </div>
        
        <input type="hidden" name="artistId" value={user?.uid || ''} />
        <input type="hidden" name="coverArtDataUri" value={coverArtDataUri || ''} />
        <input type="hidden" name="price" value={priceOption === 'recommend' && recommendedPrice ? recommendedPrice : manualPrice} />

         <Card>
            <CardHeader>
                <CardTitle>Licensing Price (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup defaultValue="recommend" value={priceOption} onValueChange={setPriceOption}>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Label htmlFor="price-recommend" className="flex flex-col gap-3 rounded-md border p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary">
                             <RadioGroupItem value="recommend" id="price-recommend" />
                             <div className="font-bold">Recommend a Price</div>
                             <p className="text-sm text-muted-foreground">Let our AI analyze the track's genre and potential to suggest a fair market price in VSD tokens.</p>
                             <Button type="button" variant="secondary" onClick={handleRecommendPrice} disabled={isPriceLoading}>
                                {isPriceLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Get Recommendation
                             </Button>
                             {recommendedPrice && priceOption === 'recommend' && (
                                <div className="flex items-center gap-2 font-bold text-lg text-primary">
                                    <Icons.vsd className="h-5 w-5" /> {recommendedPrice} VSD
                                </div>
                             )}
                        </Label>
                        <Label htmlFor="price-manual" className="flex flex-col gap-3 rounded-md border p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary">
                            <RadioGroupItem value="manual" id="price-manual" />
                            <div className="font-bold">Set Manual Price</div>
                            <p className="text-sm text-muted-foreground">Set your own licensing price in VSD tokens. You can change this at any time from your catalog.</p>
                             <div className="relative mt-auto">
                                <Icons.vsd className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="Enter VSD Amount" className="pl-9" value={manualPrice} onChange={e => setManualPrice(e.target.value)} disabled={priceOption !== 'manual'} />
                             </div>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
        
        {uploadState.errors?._form && <p className="text-sm text-destructive">{uploadState.errors._form[0]}</p>}
        
        <div className="space-y-2">
            <UploadProgress />
            <div className="flex justify-end pt-4">
                <UploadButton />
            </div>
        </div>
      </form>
    </>
  );
}
