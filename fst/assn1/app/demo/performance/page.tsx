/**
 * Core Web Vitals Performance Page — SERVER COMPONENT
 */
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Timer, Layout, MousePointer, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Core Web Vitals",
  description: "LCP, CLS, INP — definitions and optimization strategies",
};

const vitals = [
  {
    id: "LCP",
    name: "Largest Contentful Paint",
    icon: Timer,
    color: "blue",
    description: "Measures how long it takes for the largest visible content element to render in the viewport.",
    good: "≤ 2.5s",
    needsImprovement: "≤ 4.0s",
    poor: "> 4.0s",
    what: "The render time of the largest image or text block visible in the viewport. Measures loading performance from the user's perspective.",
    why: "Users perceive the LCP element as the main content. A slow LCP means users wait to see useful content — a primary indicator of perceived load speed.",
    optimizations: [
      "Use Next.js Image component with priority prop for above-fold images",
      "Server-render content so HTML arrives early (RSC advantage)",
      "Preload critical fonts and hero images",
      "Minimize render-blocking CSS/JS resources",
      "Use streaming (React Suspense) to send HTML progressively",
      "Serve images in modern formats (WebP, AVIF) at correct sizes",
    ],
  },
  {
    id: "CLS",
    name: "Cumulative Layout Shift",
    icon: Layout,
    color: "purple",
    description: "Measures visual stability — how much page content unexpectedly shifts during loading.",
    good: "≤ 0.1",
    needsImprovement: "≤ 0.25",
    poor: "> 0.25",
    what: "A score (not a time) calculated from the size and distance of unexpected layout shifts. A shift score of 0 means no shifts; higher is worse.",
    why: "Layout shifts cause users to click the wrong things, lose their reading position, or experience jarring visual jumps. Even a single large shift can ruin the experience.",
    optimizations: [
      "Always specify width and height for images and videos",
      "Reserve space for dynamic content (ads, embeds) with CSS aspect-ratio",
      "Load fonts with display: swap and preload critical fonts",
      "Avoid inserting content above existing content after load",
      "Use transform animations instead of layout-shifting properties (top, left, width)",
      "Use next/font to avoid flash of unstyled text (FOUT)",
    ],
  },
  {
    id: "INP",
    name: "Interaction to Next Paint",
    icon: MousePointer,
    color: "green",
    description: "Measures how responsive a page is to user interactions — the successor to FID (First Input Delay).",
    good: "≤ 200ms",
    needsImprovement: "≤ 500ms",
    poor: "> 500ms",
    what: "The 98th percentile latency of all user interactions (clicks, taps, keyboard presses) throughout the entire page lifetime — not just the first one like FID.",
    why: "FID only measured the first interaction. INP captures all interactions, making it a much better measure of overall interactivity quality, especially for SPAs.",
    optimizations: [
      "Keep Client Components small — large JS bundles delay interaction handling",
      "Avoid long-running JavaScript tasks (>50ms) on the main thread",
      "Defer non-critical Client Components with React.lazy",
      "Use web workers for CPU-intensive computations",
      "Minimize unnecessary re-renders with Zustand selectors",
      "Reduce event handler complexity — debounce expensive handlers",
    ],
  },
];

const historicalNote = {
  id: "FID",
  name: "First Input Delay (Historical)",
  note: "FID measured the delay for the first user interaction only. It was replaced by INP in March 2024 as a Core Web Vital because INP provides a more complete picture of interactivity across the entire page session.",
};

export default function PerformancePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge className="bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/20">
            <BarChart3 className="h-3 w-3 mr-1" />
            Core Web Vitals
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Core Web Vitals & Performance</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Google&apos;s Core Web Vitals are the three metrics that matter most for user experience.
          Understanding and optimizing them is essential for production Next.js applications.
        </p>
      </div>

      {/* Quick reference */}
      <div className="grid gap-3 sm:grid-cols-3">
        {vitals.map((v) => {
          const Icon = v.icon;
          const colorStyles = {
            blue: "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20",
            purple: "border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20",
            green: "border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/20",
          };
          const badgeStyles = {
            blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
            purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
            green: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
          };
          return (
            <div
              key={v.id}
              className={`rounded-lg border p-4 ${colorStyles[v.color as keyof typeof colorStyles]}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${badgeStyles[v.color as keyof typeof badgeStyles]}`}>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <span className="text-base font-bold">{v.id}</span>
              </div>
              <p className="text-xs font-medium">{v.name}</p>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Good</span>
                  <span className="font-medium text-green-600">{v.good}</span>
                </div>
                <div className="flex justify-between">
                  <span>Needs work</span>
                  <span className="font-medium text-yellow-600">{v.needsImprovement}</span>
                </div>
                <div className="flex justify-between">
                  <span>Poor</span>
                  <span className="font-medium text-red-600">{v.poor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed breakdown */}
      {vitals.map((v) => {
        const Icon = v.icon;
        return (
          <Card key={v.id} id={v.id.toLowerCase()}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {v.id} — {v.name}
              </CardTitle>
              <CardDescription>{v.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold mb-1">What it measures</h3>
                  <p className="text-xs text-muted-foreground">{v.what}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">Why it matters</h3>
                  <p className="text-xs text-muted-foreground">{v.why}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Optimization strategies</h3>
                <ul className="space-y-1.5" role="list">
                  {v.optimizations.map((opt) => (
                    <li key={opt} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-green-500 shrink-0 mt-0.5" aria-hidden="true">✓</span>
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* FID historical note */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {historicalNote.id} — {historicalNote.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{historicalNote.note}</p>
        </CardContent>
      </Card>

      {/* Next.js specific tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Next.js-Specific Optimizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { feature: "next/image", benefit: "Automatic WebP/AVIF, lazy loading, prevents CLS with explicit dimensions" },
              { feature: "next/font", benefit: "Zero layout shift font loading, automatic self-hosting, no external requests" },
              { feature: "React Server Components", benefit: "Zero JS for static content, smaller bundles, faster TTI/INP" },
              { feature: "App Router Streaming", benefit: "Progressive HTML delivery with Suspense — better LCP for data-heavy pages" },
              { feature: "Route Prefetching", benefit: "Prefetches page JS on hover — instant navigation without reload" },
              { feature: "Static Generation (SSG)", benefit: "Pre-rendered HTML at build time, served from CDN — best LCP possible" },
            ].map((item) => (
              <div key={item.feature} className="rounded-md bg-muted/50 p-3">
                <code className="text-xs font-mono font-semibold">{item.feature}</code>
                <p className="text-xs text-muted-foreground mt-1">{item.benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
