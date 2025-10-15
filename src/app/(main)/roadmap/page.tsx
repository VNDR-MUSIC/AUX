
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, DraftingCompass } from 'lucide-react';

const roadmapFeatures = [
  {
    title: 'Music Auctions Platform',
    status: 'In Development',
    description: 'A full-featured auction house for artists to buy and sell music rights using VSD tokens. Includes bidding, escrow, and smart contract integration.',
    icon: <DraftingCompass className="h-6 w-6 text-primary" />,
    statusColor: 'bg-yellow-500',
  },
  {
    title: 'AI-Powered Reporting Engine',
    status: 'In Development',
    description: 'Generate in-depth PDF reports on your catalog\'s performance, including stream analysis, listener demographics, and revenue projections for a VSD token fee.',
    icon: <DraftingCompass className="h-6 w-6 text-primary" />,
    statusColor: 'bg-yellow-500',
  },
  {
    title: 'Advanced AI Songwriting Tools',
    status: 'Planned',
    description: 'A suite of tools to assist in the creative process, including lyric suggestions, melody generation, and chord progression analysis.',
    icon: <Clock className="h-6 w-6 text-primary" />,
    statusColor: 'bg-blue-500',
  },
  {
    title: 'Expanded Distribution Network',
    status: 'Launched',
    description: 'Distribution to over 150+ platforms including Spotify, Apple Music, and more.',
    icon: <Check className="h-6 w-6 text-primary" />,
    statusColor: 'bg-green-600',
  },
   {
    title: 'VSD Token & Daily Rewards',
    status: 'Launched',
    description: 'The native VSD token economy with daily rewards for artists is live.',
    icon: <Check className="h-6 w-6 text-primary" />,
    statusColor: 'bg-green-600',
  },
];

export default function RoadmapPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Platform Roadmap
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Here&apos;s a look at what we&apos;ve launched, what we&apos;re building now, and what&apos;s coming next.
        </p>
      </div>

      <div className="space-y-8">
        {roadmapFeatures.map((feature, index) => (
          <Card key={index} className="flex flex-col sm:flex-row items-start gap-6 p-6">
            <div className="p-3 bg-card rounded-full border">
                {feature.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                <Badge className={`${feature.statusColor} text-white`}>{feature.status}</Badge>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
