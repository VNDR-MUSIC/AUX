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
  { month: "January", track: 2810, track2: 2000 },
  { month: "February", track: 2750, track2: 1800 },
  { month: "March", track: 3200, track2: 2200 },
  { month: "April", track: 3000, track2: 2500 },
  { month: "May", track: 3500, track2: 2100 },
  { month: "June", track: 3800, track2: 2800 },
];

const chartConfig = {
  track: {
    label: "Midnight Bloom",
    color: "hsl(var(--primary))",
  },
  track2: {
    label: "Crystal Caverns",
    color: "hsl(var(--accent))",
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
      </BarChart>
    </ChartContainer>
  );
}
