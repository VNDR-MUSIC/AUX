'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";

export default function SymbiPage() {
  return (
    <div className="container mx-auto py-8 flex h-[calc(100vh-10rem)] justify-center items-center">
      <Card className="w-full max-w-2xl h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Symbi Chat</CardTitle>
          <CardDescription>
            Your AI assistant, powered by Google NotebookLM.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
            <ScrollArea className="h-[400px] w-full p-4 border rounded-lg">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                         <Avatar>
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg max-w-xs">
                            <p className="text-sm">Hello! How can I help you connect with Google NotebookLM today?</p>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter>
            <div className="w-full flex items-center gap-2">
                <Input placeholder="Ask Symbi a question..." />
                <Button>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
