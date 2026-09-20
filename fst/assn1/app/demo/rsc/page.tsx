/**
 * RSC Demo Page — SERVER COMPONENT
 *
 * This page demonstrates:
 * 1. Server Component rendering (this file itself)
 * 2. Data fetching on the server (simulated delay)
 * 3. The RSC → Client boundary via the ServerContent / ClientIsland split
 * 4. Serializable props crossing the boundary
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ServerDataCard } from "@/components/rsc/server-data-card";
import { ClientIsland } from "@/components/rsc/client-island";
import { ArchitectureDiagram } from "@/components/rsc/architecture-diagram";
import { Server, Monitor, ArrowDown } from "lucide-react";

export const metadata: Metadata = {
  title: "RSC vs Client Components",
  description: "Visual demonstration of the RSC → Client boundary",
};

// Simulate async server-side data fetching (database, API, etc.)
async function getServerData() {
  // This delay runs on the SERVER — no client JS involved
  await new Promise((r) => setTimeout(r, 300));
  return {
    timestamp: new Date().toISOString(),
    renderedOn: "server",
    nodeVersion: process.version,
    environment: process.env.NODE_ENV ?? "development",
    dataSource: "Simulated async server fetch (would be DB/API in production)",
    serializedProps: {
      title: "Project Alpha",
      status: "active",
      count: 42,
    },
  };
}

export default async function RSCPage() {
  // ✅ Async data fetch happens on the server before rendering
  const serverData = await getServerData();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20">
            <Server className="h-3 w-3 mr-1" aria-hidden="true" />
            Part A — RSC vs Client
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">RSC vs Client Components</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          This page is a Server Component. Below you can see how data fetching, 
          the RSC→Client boundary, and interactive islands all work together.
        </p>
      </div>

      {/* Architecture Diagram */}
      <ArchitectureDiagram />

      {/* The Render Tree */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Live Render Tree</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Left: Server side */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-600/30">
                <Server className="h-3 w-3 mr-1" />
                Server Component
              </Badge>
            </div>
            <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded font-mono">
                    app/demo/rsc/page.tsx
                  </code>
                </CardTitle>
                <CardDescription>
                  Async Server Component — fetches data before rendering. No JavaScript bundle sent to browser.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Suspense fallback={<ServerDataSkeleton />}>
                  <ServerDataCard data={serverData} />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Right: Client side */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-600/30">
                <Monitor className="h-3 w-3 mr-1" />
                Client Component
              </Badge>
            </div>
            <Card className="border-orange-200 dark:border-orange-900/50 bg-orange-50/30 dark:bg-orange-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <code className="text-xs bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 rounded font-mono">
                    components/rsc/client-island.tsx
                  </code>
                </CardTitle>
                <CardDescription>
                  Client Component — receives serializable props from server, has useState/useEffect, sends JS to browser.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/*
                 * Props crossing the RSC → Client boundary MUST be serializable.
                 * We pass a plain object (not a function, class instance, or Symbol).
                 */}
                <ClientIsland
                  initialData={{
                    title: serverData.serializedProps.title,
                    status: serverData.serializedProps.status,
                    count: serverData.serializedProps.count,
                    serverTimestamp: serverData.timestamp,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Server Components",
                content: "Run only on the server. Can be async, fetch data directly, access secrets. Zero JS sent to browser.",
                color: "border-l-blue-500",
              },
              {
                label: "Client Components",
                content: '"use client" directive. Can use useState, useEffect, event handlers. JS bundle sent to browser for hydration.',
                color: "border-l-orange-500",
              },
              {
                label: "RSC → Client Boundary",
                content: "Props passed from Server to Client must be serializable (strings, numbers, plain objects, arrays). No functions or class instances.",
                color: "border-l-purple-500",
              },
              {
                label: "Hydration",
                content: "React re-runs Client Components in the browser to attach event handlers. Server HTML is reused — not discarded.",
                color: "border-l-green-500",
              },
            ].map((concept) => (
              <div
                key={concept.label}
                className={`border-l-4 ${concept.color} pl-3 py-1`}
              >
                <h3 className="text-sm font-semibold">{concept.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{concept.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ServerDataSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
