/**
 * Sidebar navigation — SERVER COMPONENT
 * No client-side JS needed; just renders links.
 * Active state is handled by client component SidebarLink.
 */
import { Layers } from "lucide-react";
import { SidebarLink } from "./sidebar-link";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", iconName: "Home" },
  { href: "/demo/rsc", label: "RSC vs Client", iconName: "Layers" },
  { href: "/demo/zustand", label: "Zustand Cart", iconName: "ShoppingCart" },
  { href: "/demo/forms", label: "Type-Safe Forms", iconName: "FileText" },
  { href: "/demo/hydration", label: "Hydration", iconName: "Zap" },
  { href: "/demo/performance", label: "Core Web Vitals", iconName: "BarChart3" },
  { href: "/demo/lighthouse", label: "Lighthouse Audit", iconName: "Gauge" },
] as const;

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border bg-card">
      {/* Brand */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Layers className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">Next.js Lab</span>
          <span className="text-xs text-muted-foreground leading-tight">Assignment 1</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.href} href={item.href} label={item.label} iconName={item.iconName} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          FSTL Assignment 1 · Full-Stack Next.js Architecture
        </p>
      </div>
    </aside>
  );
}
