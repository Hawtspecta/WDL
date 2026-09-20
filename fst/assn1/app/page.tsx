/**
 * Dashboard Homepage — SERVER COMPONENT
 *
 * This entire page renders on the server. No "use client" needed.
 * The only client JS that loads is the interactive islands
 * (ThemeToggle, MobileNav) imported inside the layout.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Layers,
  ShoppingCart,
  FileText,
  Zap,
  BarChart3,
  Gauge,
  ArrowRight,
  CheckCircle2,
  Server,
  Monitor,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Full-Stack Next.js Architecture Lab — Assignment 1 Dashboard",
};

const sections = [
  {
    href: "/demo/rsc",
    icon: Layers,
    title: "RSC vs Client Components",
    description:
      "Visual demonstration of the RSC → Client boundary, serializable props, and the render tree split.",
    badge: "Part A",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    href: "/demo/zustand",
    icon: ShoppingCart,
    title: "Zustand Client State",
    description:
      "Shopping cart with localStorage persistence, quantity controls, selector-based optimisation to minimise re-renders.",
    badge: "Part B",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    href: "/demo/forms",
    icon: FileText,
    title: "Type-Safe Form + Server Action",
    description:
      "react-hook-form + Zod + Server Action. Same schema validates on client AND server. Full mutation UX.",
    badge: "Part C",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    href: "/demo/hydration",
    icon: Zap,
    title: "Hydration Optimization",
    description:
      "What renders on server vs client, why hydration matters, and how to prevent layout shifts.",
    badge: "Perf",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  {
    href: "/demo/performance",
    icon: BarChart3,
    title: "Core Web Vitals",
    description:
      "LCP, CLS, INP explained with optimization strategies and interactive dashboard.",
    badge: "Perf",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    href: "/demo/lighthouse",
    icon: Gauge,
    title: "Lighthouse Audit",
    description:
      "How to run a real Lighthouse audit. Report template — no fabricated numbers.",
    badge: "Audit",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
];

const techStack = [
  "Next.js 16 App Router",
  "React 19 (RSC)",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Radix UI",
  "next-themes",
  "Zustand v5",
  "Zod v4",
  "react-hook-form",
  "Server Actions",
  "Lucide Icons",
];

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero */}
      <section aria-labelledby="hero-heading">
        <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/30 p-6 lg:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">FSTL Assignment 1</Badge>
              <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-600/30">
                Production-Quality Demo
              </Badge>
            </div>
            <div>
              <h1
                id="hero-heading"
                className="text-2xl lg:text-3xl font-bold tracking-tight"
              >
                Full-Stack Next.js Architecture Lab
              </h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                An academic demonstration of modern Next.js 16 architecture patterns:
                React Server Components, Zustand client state management, end-to-end
                type-safe form mutations, hydration optimization, and Core Web Vitals.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Server className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Server Components by default</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Minimal client JS</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                <span>Accessible &amp; Responsive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Sections */}
      <section aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="text-lg font-semibold mb-4">
          Assignment Demonstrations
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.href}
                className="group hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${section.color}`}
                      aria-hidden="true"
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {section.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-3">{section.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={section.href}
                    aria-label={`Go to ${section.title}`}
                    className="inline-flex items-center justify-center w-full h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] border border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                  >
                    Explore
                    <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section aria-labelledby="tech-heading">
        <h2 id="tech-heading" className="text-lg font-semibold mb-4">
          Tech Stack
        </h2>
        <Card>
          <CardContent className="pt-5">
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Architecture Note */}
      <section aria-labelledby="arch-heading">
        <h2 id="arch-heading" className="text-lg font-semibold mb-4">
          Architecture Principles
        </h2>
        <Card>
          <CardContent className="pt-5">
            <ul className="space-y-3" role="list">
              {[
                {
                  icon: "🖥️",
                  text: "Server Components by default — only add 'use client' when interactivity is needed",
                },
                {
                  icon: "🏝️",
                  text: "Interactive islands — client components are kept small and focused",
                },
                {
                  icon: "🔒",
                  text: "Type-safe end-to-end — Zod validates on both client and server",
                },
                {
                  icon: "💾",
                  text: "Zustand state isolated to components that actually need it, with selectors to prevent unnecessary re-renders",
                },
                {
                  icon: "♿",
                  text: "Accessible — semantic HTML, ARIA labels, keyboard navigation, focus states",
                },
              ].map((item) => (
                <li key={item.icon} className="flex items-start gap-3 text-sm">
                  <span className="text-base shrink-0" aria-hidden="true">{item.icon}</span>
                  <span className="text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
