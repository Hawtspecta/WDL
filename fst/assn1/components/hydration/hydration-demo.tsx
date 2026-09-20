"use client";

/**
 * HydrationDemo — CLIENT COMPONENT
 * 
 * Demonstrates the difference between server render time and client hydration time.
 * Uses useEffect to detect when hydration is complete.
 */
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Monitor, Server } from "lucide-react";

interface HydrationDemoProps {
  serverTime: string; // ISO string from server (serializable)
}

export function HydrationDemo({ serverTime }: HydrationDemoProps) {
  const [hydratedAt, setHydratedAt] = useState<string | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    // This runs ONLY after hydration — never on the server
    setHydratedAt(new Date().toISOString());
    setRenderCount(1);
  }, []);

  const serverDate = new Date(serverTime);
  const hydrationDate = hydratedAt ? new Date(hydratedAt) : null;
  const diff = hydrationDate
    ? Math.round(hydrationDate.getTime() - serverDate.getTime())
    : null;

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Server render */}
          <div className="rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Server className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Server Render</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Time (IST)</p>
            <p className="text-sm font-mono font-bold tabular-nums">
              {serverDate.toLocaleTimeString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              HTML was generated here and sent to browser
            </p>
          </div>

          {/* Client hydration */}
          <div className="rounded-lg border border-orange-200 dark:border-orange-900/50 bg-orange-50/30 dark:bg-orange-950/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
              <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">Client Hydration</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Time (IST)</p>
            <p className="text-sm font-mono font-bold tabular-nums">
              {hydrationDate ? hydrationDate.toLocaleTimeString("en-IN") : "Pending…"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              React attached event handlers in the browser
            </p>
          </div>

          {/* Delta */}
          <div
            className={`rounded-lg border p-4 ${
              hydratedAt
                ? "border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-950/20"
                : "border-border"
            }`}
            aria-live="polite"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2
                className={`h-3.5 w-3.5 ${hydratedAt ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold">
                {hydratedAt ? "Hydrated ✅" : "Awaiting…"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Hydration lag</p>
            <p className="text-sm font-mono font-bold tabular-nums">
              {diff !== null ? `~${diff}ms` : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Time for JS to download, parse, and hydrate
            </p>
          </div>
        </div>

        {hydratedAt && (
          <div className="mt-4 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>
              <strong>What just happened:</strong>
            </p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Server rendered this component&apos;s HTML at {serverDate.toLocaleTimeString("en-IN")}</li>
              <li>Browser received the HTML and rendered it immediately</li>
              <li>React&apos;s JS bundle loaded and executed</li>
              <li><code className="font-mono">useEffect</code> ran at {hydrationDate?.toLocaleTimeString("en-IN")} — confirming hydration is complete</li>
              <li>The page was fully interactive from this point</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
