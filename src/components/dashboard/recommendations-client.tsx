"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { aiPoweredRecommendations } from "@/ai/flows/ai-powered-recommendations";
import { useToast } from "@/hooks/use-toast";

export default function RecommendationsClient() {
  const [recommendations, setRecommendations] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations("");
    try {
      const result = await aiPoweredRecommendations({
        listeningHistory: "Listened to synthwave, future funk, and lofi hip-hop.",
      });
      setRecommendations(result.recommendations);
    } catch (error) {
        console.error("Failed to get recommendations:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch AI recommendations. Please try again later.",
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {recommendations && (
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground text-sm">
          {recommendations.split('\n').map((line, index) => {
            // Basic markdown-like parsing for titles
            if (line.startsWith('* **') || line.startsWith('- **')) {
              return <p key={index} className="font-semibold text-foreground">{line.replace(/\*|\-/g, '').trim()}</p>
            }
            return <p key={index}>{line.replace(/\*|\-/g, '').trim()}</p>
          })}
        </div>
      )}
      <Button
        onClick={handleGetRecommendations}
        disabled={isLoading}
        className="w-full"
        variant="outline"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        {isLoading ? "Generating..." : "Generate New Recommendations"}
      </Button>
    </div>
  );
}
