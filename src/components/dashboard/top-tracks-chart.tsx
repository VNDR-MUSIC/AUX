
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Track } from "@/store/music-player-store";

interface TopTracksChartProps {
  data: Track[];
}

const chartConfig = {
  plays: {
    label: "Plays",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function TopTracksChart({ data }: TopTracksChartProps) {
  const chartData = data.slice(0, 6).map(track => ({
    name: track.title.length > 15 ? `${track.title.substring(0, 15)}...` : track.title,
    plays: track.plays || 0,
  }));
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No track data available to display chart.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData} layout="vertical">
        <defs>
            <linearGradient id="colorSoundwave" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
            </linearGradient>
        </defs>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <XAxis type="number" hide />
        <ChartTooltip cursor={{ fill: "hsl(var(--muted)/0.5)"}} content={<ChartTooltipContent />} />
        <Bar dataKey="plays" fill="url(#colorSoundwave)" radius={4} layout="vertical" />
      </BarChart>
    </ChartContainer>
  );
}
