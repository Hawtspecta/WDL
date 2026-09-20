/**
 * Lighthouse Audit Page — SERVER COMPONENT
 *
 * Contains:
 * - How to run a Lighthouse audit
 * - Report template (no fabricated numbers)
 * - Clear instructions for evaluators
 */
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Gauge, Terminal, Info, ExternalLink, ClipboardList } from "lucide-react";

export const metadata: Metadata = {
  title: "Lighthouse Audit",
  description: "How to run a Lighthouse audit and Core Web Vitals report",
};

export default function LighthousePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20">
            <Gauge className="h-3 w-3 mr-1" />
            Lighthouse Audit
          </Badge>
          <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400 border-yellow-600/30">
            <Info className="h-3 w-3 mr-1" />
            No fabricated scores — run audit to populate
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Lighthouse Audit</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          This page provides a template for recording real Lighthouse scores.
          All scores must be measured by running an actual audit — no numbers are invented.
        </p>
      </div>

      {/* Important disclaimer */}
      <Card className="border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/30 dark:bg-yellow-950/20">
        <CardContent className="pt-5">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Academic Integrity Notice
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                All Lighthouse scores in this report must be measured by running an actual Lighthouse audit
                against this application. Scores are <strong>not pre-populated</strong> to avoid
                fabrication. Follow the instructions below to generate real results and update
                the report template with your measured values.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to run Lighthouse */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="h-4 w-4" aria-hidden="true" />
            How to Run a Lighthouse Audit
          </CardTitle>
          <CardDescription>
            Follow these steps to generate a real Lighthouse report for this application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-4">
            {/* Method 1: Chrome DevTools */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary">Method 1</Badge>
                Chrome DevTools (Recommended)
              </h3>
              <ol className="space-y-2" role="list">
                {[
                  "Start the dev server: npm run dev (or npm run build && npm start for production scores)",
                  "Open http://localhost:3000 in Google Chrome",
                  "Open DevTools: F12 or right-click → Inspect",
                  "Navigate to the Lighthouse tab",
                  'Select categories: Performance, Accessibility, Best Practices, SEO',
                  'Select "Desktop" or "Mobile" device mode',
                  'Click "Analyze page load"',
                  "Wait for the audit to complete (~30–60 seconds)",
                  "Record the scores below in the report template",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <Separator />

            {/* Method 2: CLI */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary">Method 2</Badge>
                Lighthouse CLI
              </h3>
              <div className="space-y-2">
                <pre className="text-xs font-mono bg-muted rounded-lg p-3 overflow-auto">
{`# Install Lighthouse CLI globally
npm install -g lighthouse

# Run audit (ensure dev server is running first)
npm run dev &
sleep 5
lighthouse http://localhost:3000 \\
  --output html \\
  --output-path ./lighthouse-report.html \\
  --preset desktop

# Open the HTML report
start lighthouse-report.html   # Windows
open lighthouse-report.html    # Mac`}
                </pre>
              </div>
            </div>

            <Separator />

            {/* Method 3: PageSpeed Insights */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary">Method 3</Badge>
                PageSpeed Insights (deployed build)
              </h3>
              <p className="text-sm text-muted-foreground">
                Deploy to Vercel or similar, then visit{" "}
                <a
                  href="https://pagespeed.web.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  pagespeed.web.dev
                  <ExternalLink className="h-3 w-3" aria-label="opens in new tab" />
                </a>{" "}
                with your deployment URL.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report template */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Audit Report Template
          </CardTitle>
          <CardDescription>
            Fill in these values after running your Lighthouse audit. All values are{" "}
            <strong>To be measured</strong> until the audit is run.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Category scores */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Lighthouse Category Scores (0–100)</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { category: "Performance", color: "orange", hint: "Measures LCP, CLS, INP, TBT, Speed Index" },
                { category: "Accessibility", color: "blue", hint: "ARIA, labels, color contrast, keyboard navigation" },
                { category: "Best Practices", color: "purple", hint: "HTTPS, no deprecated APIs, secure requests" },
                { category: "SEO", color: "green", hint: "Meta tags, robots.txt, crawlability" },
              ].map((item) => {
                const borderStyles: Record<string, string> = {
                  orange: "border-orange-200 dark:border-orange-800",
                  blue: "border-blue-200 dark:border-blue-800",
                  purple: "border-purple-200 dark:border-purple-800",
                  green: "border-green-200 dark:border-green-800",
                };
                return (
                  <div
                    key={item.category}
                    className={`rounded-lg border ${borderStyles[item.color]} p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">{item.category}</span>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        To be measured
                      </Badge>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted mb-2" aria-label={`${item.category} score: not yet measured`}>
                      <div className="h-full w-0 rounded-full bg-muted-foreground/20" />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.hint}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Core Web Vitals */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Core Web Vitals</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Metric</th>
                    <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Full Name</th>
                    <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">Good Threshold</th>
                    <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Measured Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { metric: "LCP", name: "Largest Contentful Paint", good: "≤ 2.5s" },
                    { metric: "CLS", name: "Cumulative Layout Shift", good: "≤ 0.1" },
                    { metric: "INP", name: "Interaction to Next Paint", good: "≤ 200ms" },
                    { metric: "TBT", name: "Total Blocking Time", good: "≤ 200ms" },
                    { metric: "FCP", name: "First Contentful Paint", good: "≤ 1.8s" },
                    { metric: "TTI", name: "Time to Interactive", good: "≤ 3.8s" },
                  ].map((row) => (
                    <tr key={row.metric}>
                      <td className="py-2 pr-4">
                        <code className="text-xs font-mono font-semibold">{row.metric}</code>
                      </td>
                      <td className="py-2 pr-4 text-xs text-muted-foreground">{row.name}</td>
                      <td className="py-2 pr-4">
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600/30">
                          {row.good}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <Badge variant="secondary" className="text-xs">
                          Run audit →
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions for filling */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-semibold mb-2">📋 How to populate this report:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Run the audit using one of the three methods above</li>
              <li>Update <code className="font-mono">docs/assignment-1-report.md</code> section 8 with your real scores</li>
              <li>Take a screenshot of the full Lighthouse report and save it to <code className="font-mono">public/lighthouse-report.png</code></li>
              <li>Update <code className="font-mono">docs/DEMO-CHECKLIST.md</code> to mark the Lighthouse task as done</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* What Lighthouse tests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">What Lighthouse Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                category: "Performance",
                checks: ["LCP, CLS, INP, TBT measurements", "Image optimization", "JavaScript bundle size", "CSS blocking resources", "Font loading", "Caching policies"],
              },
              {
                category: "Accessibility",
                checks: ["ARIA roles and labels", "Color contrast ratios", "Keyboard navigability", "Form labels", "Focus management", "Alt text for images"],
              },
              {
                category: "Best Practices",
                checks: ["HTTPS usage", "No deprecated APIs", "Browser error-free", "Secure CSP", "Correct aspect ratios", "No password in URLs"],
              },
              {
                category: "SEO",
                checks: ["Title and meta description", "robots.txt", "Canonical URLs", "Mobile-friendly", "Structured data", "Crawlable links"],
              },
            ].map((item) => (
              <div key={item.category} className="space-y-2">
                <h3 className="text-sm font-semibold">{item.category}</h3>
                <ul className="space-y-1">
                  {item.checks.map((check) => (
                    <li key={check} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-muted-foreground/50 mt-0.5" aria-hidden="true">•</span>
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
