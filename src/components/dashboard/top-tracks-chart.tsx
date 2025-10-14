
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", track: 2810, track2: 2000, track3: 1500 },
  { month: "February", track: 2750, track2: 1800, track3: 1600 },
  { month: "March", track: 3200, track2: 2200, track3: 1800 },
  { month: "April", track: 3000, track2: 2500, track3: 2000 },
  { month: "May", track: 3500, track2: 2100, track3: 2200 },
  { month: "June", track: 3800, track2: 2800, track3: 2500 },
];

const chartConfig = {
  track: {
    label: "Midnight Bloom",
    color: "hsl(var(--chart-1))",
  },
  track2: {
    label: "Crystal Caverns",
    color: "hsl(var(--chart-2))",
  },
  track3: {
    label: "Neon Drive",
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig;

export default function TopTracksChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="track" fill="var(--color-track)" radius={4} />
        <Bar dataKey="track2" fill="var(--color-track2)" radius={4} />
        <Bar dataKey="track3" fill="var(--color-track3)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
