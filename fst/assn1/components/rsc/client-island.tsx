"use client";

/**
 * ClientIsland — CLIENT COMPONENT
 *
 * This component:
 * - Receives SERIALIZABLE props from the Server Component parent
 * - Uses useState, useEffect (client-only hooks)
 * - Maintains local interactive state (click counter, timer)
 * - Is part of the JS bundle sent to the browser
 *
 * BOUNDARY RULE: Props must be serializable.
 * ✅ Strings, numbers, plain objects, arrays
 * ❌ Functions, Date objects, class instances, Symbols
 */
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, RefreshCw, Plus, Minus } from "lucide-react";

interface ClientIslandProps {
  initialData: {
    title: string;         // ✅ string
    status: string;        // ✅ string
    count: number;         // ✅ number
    serverTimestamp: string; // ✅ string (not Date — Date is not serializable)
  };
}

export function ClientIsland({ initialData }: ClientIslandProps) {
  // Client-side state — does not exist on the server
  const [count, setCount] = useState(initialData.count);
  const [clickCount, setClickCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [clientTime, setClientTime] = useState<string>("");

  // Effect runs ONLY in the browser, after hydration
  useEffect(() => {
    setHydrated(true);
    setClientTime(new Date().toLocaleTimeString("en-IN"));
    const interval = setInterval(() => {
      setClientTime(new Date().toLocaleTimeString("en-IN"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4" role="region" aria-label="Interactive client component">
      <div className="flex items-center gap-2">
        <Monitor className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
          Hydrated: {hydrated ? "✅ Yes" : "⏳ Pending"}
        </span>
      </div>

      {/* Received serializable props */}
      <div className="rounded-md border border-orange-200 dark:border-orange-900/50 p-3">
        <p className="text-xs font-medium mb-2 text-orange-700 dark:text-orange-300">
          ← Props received from Server:
        </p>
        <dl className="space-y-1">
          <div className="flex justify-between text-xs">
            <dt className="text-muted-foreground">title</dt>
            <dd className="font-mono font-medium">&quot;{initialData.title}&quot;</dd>
          </div>
          <div className="flex justify-between text-xs">
            <dt className="text-muted-foreground">status</dt>
            <dd>
              <Badge variant="outline" className="text-xs h-4">
                {initialData.status}
              </Badge>
            </dd>
          </div>
          <div className="flex justify-between text-xs">
            <dt className="text-muted-foreground">server rendered at</dt>
            <dd className="font-mono text-muted-foreground">
              {new Date(initialData.serverTimestamp).toLocaleTimeString("en-IN")}
            </dd>
          </div>
        </dl>
      </div>

      {/* Interactive client state */}
      <div className="rounded-md bg-orange-50/50 dark:bg-orange-950/20 p-3 space-y-3">
        <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
          Interactive Client State:
        </p>

        {/* Counter */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Count (useState)</span>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={() => setCount((c) => Math.max(0, c - 1))}
              aria-label="Decrease count"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-mono font-bold w-6 text-center">{count}</span>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={() => setCount((c) => c + 1)}
              aria-label="Increase count"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Live clock (useEffect) */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Client time (useEffect)</span>
          <span className="text-xs font-mono font-medium tabular-nums">
            {clientTime || "—"}
          </span>
        </div>

        {/* Click counter */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs h-7"
          onClick={() => setClickCount((c) => c + 1)}
        >
          <RefreshCw className="h-3 w-3 mr-1.5" aria-hidden="true" />
          Click Counter: {clickCount}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        💡 This component&apos;s JS is included in the browser bundle. The server component above has <strong>zero</strong> JS in the bundle.
      </p>
    </div>
  );
}
