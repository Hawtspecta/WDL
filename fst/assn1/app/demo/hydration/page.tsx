/**
 * Hydration Demo Page — SERVER COMPONENT
 * Explains and demonstrates hydration concepts.
 */
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HydrationDemo } from "@/components/hydration/hydration-demo";
import { Zap, Server, Monitor, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Hydration Optimization",
  description: "Understanding hydration, RSC, and preventing layout shifts",
};

export default function HydrationPage() {
  // This data is available at server-render time
  const serverRenderedAt = new Date().toISOString();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/20">
            <Zap className="h-3 w-3 mr-1" />
            Hydration Optimization
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Hydration Optimization</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Understanding what renders on the server, what renders on the client,
          where hydration happens, and how to prevent common pitfalls.
        </p>
      </div>

      {/* What is hydration? */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">What Is Hydration?</CardTitle>
          <CardDescription>
            The process of attaching React interactivity to server-rendered HTML.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm font-medium">Server renders HTML</p>
                <p className="text-xs text-muted-foreground">
                  Next.js renders all Server Components to HTML on the server. This HTML is sent to the browser immediately — users see content before JS loads.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold mt-0.5">
                2
              </div>
              <div>
                <p className="text-sm font-medium">Browser receives JS bundle</p>
                <p className="text-xs text-muted-foreground">
                  Only Client Components contribute to the JS bundle. React runs in the browser and &quot;hydrates&quot; the existing HTML — it attaches event handlers without re-rendering.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold mt-0.5">
                3
              </div>
              <div>
                <p className="text-sm font-medium">Page becomes interactive</p>
                <p className="text-xs text-muted-foreground">
                  Event handlers are attached. Zustand store initializes from localStorage. Timeouts/intervals start. The app is fully interactive.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live demo */}
      <div>
        <h2 className="text-base font-semibold mb-3">Live Demonstration</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Server rendered this page at:{" "}
          <code className="font-mono text-xs bg-muted px-1.5 rounded">
            {new Date(serverRenderedAt).toLocaleTimeString("en-IN")}
          </code>
          . The component below shows the difference between server render time and client hydration time.
        </p>
        <HydrationDemo serverTime={serverRenderedAt} />
      </div>

      <Separator />

      {/* Common hydration pitfalls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Common Hydration Pitfalls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              problem: "Theme flash / layout shift",
              cause: "next-themes reads the user's system/stored theme preference in JavaScript, but the server doesn't know the preference, so it renders the default theme. The CSS class changes after JS loads, causing a flash.",
              fix: "Use suppressHydrationWarning on <html>. Apply disableTransitionOnChange. Use CSS variables that respond to .dark class.",
              type: "warning",
            },
            {
              problem: "Date/time mismatch",
              cause: "new Date() on the server returns the build time or request time, while new Date() on the client returns the browser's current time. If you render Date.now() in a Client Component without using useEffect, you'll get a hydration warning.",
              fix: "Either render dates only client-side (after mounting), or ensure the same timezone/locale is used on both server and client.",
              type: "warning",
            },
            {
              problem: "localStorage access in SSR",
              cause: "localStorage doesn't exist on the server. Accessing it in a top-level Client Component or without checking typeof window will crash during SSR.",
              fix: "Zustand's persist middleware handles this automatically. For manual access, check typeof window !== 'undefined' or use useEffect.",
              type: "warning",
            },
            {
              problem: "Unnecessary useClient boundaries",
              cause: "Adding 'use client' to a layout or wrapper component forces ALL children to become client components, even if they don't need to be. This increases the JS bundle and hydration cost.",
              fix: "Push 'use client' as far down the tree as possible. Keep interactive islands small. Pass server data as serializable props.",
              type: "good",
            },
          ].map((item) => (
            <div
              key={item.problem}
              className={`rounded-lg border p-4 ${
                item.type === "warning"
                  ? "border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/30 dark:bg-yellow-950/20"
                  : "border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-950/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {item.type === "warning" ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                )}
                <span className="text-sm font-semibold">{item.problem}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                <strong>Cause:</strong> {item.cause}
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Fix:</strong> {item.fix}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hydration optimization strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Optimization Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: "🏝️",
                title: "Small interactive islands",
                desc: "Keep Client Components focused on the interactive part only. Large 'use client' wrappers ship unnecessary JS.",
              },
              {
                icon: "📦",
                title: "Server-first data fetching",
                desc: "Fetch data in Server Components. Pass serializable results as props. Avoid useEffect data fetching where RSC can do it.",
              },
              {
                icon: "⏳",
                title: "React Suspense + Streaming",
                desc: "Use <Suspense> to stream content. Critical content renders first; deferred sections stream in as they resolve.",
              },
              {
                icon: "🎨",
                title: "Font and CSS stability",
                desc: "Use next/font with display: swap. Reserve space for images with explicit dimensions. Avoid injecting CSS after page load.",
              },
            ].map((item) => (
              <div key={item.icon} className="flex gap-3">
                <span className="text-base shrink-0" aria-hidden="true">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Serializable props */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Why Serializable Props Matter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            When props cross the RSC → Client boundary, they are serialized to JSON
            (embedded in the HTML payload sent to the browser). Non-serializable values
            cannot cross this boundary.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-950/20 p-3">
              <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">✅ Serializable (can pass)</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><code className="font-mono">string, number, boolean</code></li>
                <li><code className="font-mono">null, undefined</code></li>
                <li><code className="font-mono">Plain objects {`{}`}</code></li>
                <li><code className="font-mono">Arrays []</code></li>
                <li><code className="font-mono">Date → ISO string</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 p-3">
              <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2">❌ NOT Serializable (cannot pass)</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><code className="font-mono">Functions () =&gt; {}</code></li>
                <li><code className="font-mono">Date objects</code></li>
                <li><code className="font-mono">Class instances</code></li>
                <li><code className="font-mono">Symbol</code></li>
                <li><code className="font-mono">Map, Set</code></li>
                <li><code className="font-mono">React nodes/elements</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
